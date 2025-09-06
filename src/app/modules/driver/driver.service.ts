import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IDriverInfo, } from "./driver.interface";
import { Role } from '../user/user.interface';
import { Driver } from './driver.model';


const createDriver = async (payload: Partial<IDriverInfo>, userId: string) => {

    const user = await User.findById(userId)

    if (user?.role !== Role.DRIVER) {
        throw new AppError(httpStatus.BAD_REQUEST, "Driver only access for this route")

    }
    const driver = await Driver.create({
        userID: userId,
        ...payload
    })

    return driver

}


const getAllDriver = async () => {
    const drivers = await Driver.find({})

    const totalUsers = await Driver.countDocuments()
    return {
        data: drivers,
        meta: {
            total: totalUsers
        }
    }
}

const updateDriverStatus = async (id: string, payload: Partial<IDriverInfo>) => {

    const existingDriver = await Driver.findById(id);

    if (!existingDriver) {
        throw new Error("Driver not found.");
    }

    const updatedStatus = await Driver.findByIdAndUpdate(
        id, payload,
        { new: true, runValidators: true });

    return updatedStatus
}

export const DriverService = {
    createDriver,
    getAllDriver,
    updateDriverStatus
}