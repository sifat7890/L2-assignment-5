import httpStatus from 'http-status-codes';
import { envVars } from "../../config/env";
import { IAuthProvider, IUser, Role } from "./user.interface";
import bcryptjs from "bcryptjs";
import { User } from "./user.model";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from 'jsonwebtoken';
import { Driver } from '../driver/driver.model';




// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const createUser = async (payload: Partial<IUser>, userId?: any) => {
    const { email, password, role, ...rest } = payload
    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    if (role !== Role.DRIVER && role !== Role.RIDER) {
        throw new AppError(httpStatus.BAD_REQUEST, "Driver or Rider must be needed")

    }

    const hashPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    const authProvider: IAuthProvider = { provider: "credentials", providerID: email as string }
    const user = await User.create({
        email,
        password: hashPassword,
        role,
        auths: [authProvider],
        ...rest
    })
    return user
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
        if (userId !== decodedToken.userId) {
            throw new AppError(401, "You are not authorized")
        }
    }

    const ifUserExists = await User.findById(userId)

    if (!ifUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found")
    }

    if (decodedToken.role === Role.ADMIN && ifUserExists.role === Role.SUPER_ADMIN) {
        throw new AppError(401, "You are not authorized")
    }

    if (payload.role) {
        if (decodedToken.role === Role.DRIVER || decodedToken.role === Role.RIDER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }

    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.DRIVER || decodedToken.role === Role.RIDER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }


    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdateUser
}

const getAllUsers = async () => {
    const users = await User.find({}).lean()

    const driverUserIds = users
        .filter(user => user.role === Role.DRIVER)
        .map(user => user._id);

    const driverInfos = await Driver.find({ userID: { $in: driverUserIds } }).lean();

    const driverInfoMap = new Map(
        driverInfos.map(driver => [driver.userID.toString(), driver])
    );

    const usersWithDriverInfo = users.map(user => ({
        ...user,
        driverInfo: user.role === Role.DRIVER ? driverInfoMap.get(user._id.toString()) || null : null,
    }));

    const totalUsers = await User.countDocuments()
    return {
        data: usersWithDriverInfo,
        meta: {
            total: totalUsers
        }
    }
}



export const UserServices = {
    createUser,
    getAllUsers,
    updateUser
}