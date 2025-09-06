/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError"
import { Role } from "../user/user.interface"
import { User } from "../user/user.model"
import { IRide, RIDE_STATUS } from "./rider.interface"
import { Ride } from './rider.model';


// "email": "pavel.smith@example.com",
//         "password": "Pavel@123",

//         "email": "akash.smith@example.com",
//         "password": "Akash@123",
//  "email": "zak.smith@example.com",
//         "password": "Zash@123",


const createRiderRequest = async (payload: Partial<IRide>, userId: string) => {

    const user = await User.findById(userId)

    if (user?.role !== Role.RIDER) {
        throw new AppError(httpStatus.BAD_REQUEST, "Rider only access for this route")

    }

    const activeRide = await Ride.findOne({
        rider: userId,
        status: {
            $in: [RIDE_STATUS.REQUESTED, RIDE_STATUS.ACCEPTED, RIDE_STATUS.IN_TRANSIT, RIDE_STATUS.PICKED_UP]
        }
    })

    if (activeRide) {
        throw new AppError(httpStatus.BAD_REQUEST, "You already have an active ride")
    }

    const rider = await Ride.create({
        rider: userId,
        ...payload
    })

    return rider

}


const getAllRider = async () => {


    const drivers = await Ride.find({
        status: RIDE_STATUS.REQUESTED,
        driver: null
    }).populate("rider", "name email phone ")

    const totalUsers = await Ride.countDocuments()
    return {
        data: drivers,
        meta: {
            total: totalUsers
        }
    }
}


const updateRiderAccept = async (riderId: string, payload: Partial<IRide>, driverId: string) => {

    const driver = await User.findById(driverId)


    if (driver?.role !== Role.DRIVER) {
        throw new AppError(httpStatus.BAD_REQUEST, "Driver only access for this route")

    }
    const activeRide = await Ride.findOne({
        driver: driver,
        status: {
            $in: [RIDE_STATUS.REQUESTED, RIDE_STATUS.ACCEPTED, RIDE_STATUS.IN_TRANSIT, RIDE_STATUS.PICKED_UP]
        }
    })

    if (activeRide) {
        throw new AppError(httpStatus.BAD_REQUEST, "You already have an active ride")
    }


    const rider = await Ride.findOneAndUpdate(
        { rider: riderId, status: RIDE_STATUS.REQUESTED },
        {
            $set: {
                driver: driverId,
                status: RIDE_STATUS.ACCEPTED,
                "timestamps.acceptedAt": new Date(),
                ...payload
            }
        },
        { new: true, runValidators: true }


    )

    return rider

}


const updateRiderStatus = async (riderId: string, payload: Partial<IRide>, driverId: string) => {


    const driver = await User.findById(driverId)


    if (driver?.role !== Role.DRIVER) {
        throw new AppError(httpStatus.BAD_REQUEST, "Rider only access for this route")

    }
    const activeRide = await Ride.findOne({
        driver: driver,
        status: {
            $in: [RIDE_STATUS.REQUESTED, RIDE_STATUS.ACCEPTED, RIDE_STATUS.IN_TRANSIT, RIDE_STATUS.PICKED_UP]
        },
        rider: { $ne: riderId }
    })

    if (activeRide) {
        throw new AppError(httpStatus.BAD_REQUEST, "You already have an active ride")
    }
    const ride = await Ride.findOne({
        rider: riderId,
        driver: driverId
    });

    if (!ride) {
        throw new AppError(httpStatus.BAD_REQUEST, "Ride not found or unauthorized")

    }

    const currentStatus = ride.status;
    let nextStatus: RIDE_STATUS;


    if (currentStatus === RIDE_STATUS.ACCEPTED) {
        nextStatus = RIDE_STATUS.PICKED_UP;
    } else if (currentStatus === RIDE_STATUS.PICKED_UP) {
        nextStatus = RIDE_STATUS.IN_TRANSIT;
    } else if (currentStatus === RIDE_STATUS.IN_TRANSIT) {
        nextStatus = RIDE_STATUS.COMPLETED;
    } else {
        throw new AppError(httpStatus.BAD_REQUEST, `Cannot update ride from status ${currentStatus}`);
    }
    const timestampKey = `timestamps.${nextStatus.toLowerCase()}At`;

    const updatedRiderStatus = await Ride.findOneAndUpdate(
        { rider: riderId, status: currentStatus },
        {
            $set: {
                status: nextStatus,
                [timestampKey]: new Date(),
                ...payload
            }
        },
        { new: true, runValidators: true }
    )

    return updatedRiderStatus

}


const updatedCancel = async (rideId: string, payload: Partial<IRide>, userId: string) => {

    const user = await User.findById(userId)

    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found")

    }

    const query: any = { _id: rideId };


    if (user.role === 'RIDER') {
        query.rider = userId;
    }

    if (user.role === 'DRIVER') {
        query.driver = userId;
    }

    query.status = {
        $nin: [
            RIDE_STATUS.COMPLETED,
            RIDE_STATUS.CANCELLED
        ]
    }





    const cancelRide = await Ride.findOneAndUpdate(
        query,
        {
            $set: {
                status: RIDE_STATUS.CANCELLED,
                'timestamps.canceledAt': new Date(),

            }
        }, { new: true, runValidators: true }
    )

    return cancelRide

}


const getAllRideHistory = async (userId: string) => {

    const user = await User.findById(userId)

    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found")

    }

    let query: any = {};

    if (user.role === 'RIDER') {
        query.rider = userId;
    }

    if (user.role === 'DRIVER') {
        query.driver = userId;
    }



    const rides = await Ride.find(query)
        .populate('rider', 'name email phone ')
        .populate('driver', 'name email phone ')

    const totalUsers = await Ride.countDocuments()
    return {
        data: rides,
        meta: {
            total: totalUsers
        }
    }
}

export const RiderService = {
    createRiderRequest,
    getAllRider,
    updateRiderAccept,
    updateRiderStatus,
    updatedCancel,
    getAllRideHistory
}