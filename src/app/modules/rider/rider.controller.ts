/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { JwtPayload } from 'jsonwebtoken';
import { RiderService } from './rider.service';




const createRiderRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodeToken = req.user as JwtPayload

    const rider = await RiderService.createRiderRequest(req.body, decodeToken.userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rider request successfully",
        data: rider
    })
}
)


const getAllRider = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const riders = await RiderService.getAllRider();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All riders retrieved successfully",
        data: riders.data,
        meta: riders.meta
    })
})


const updateRiderAccept = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.riderId;
    const decodeToken = req.user as JwtPayload

    const riders = await RiderService.updateRiderAccept(id, req.body,decodeToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Updated approval successfully",
        data: riders
    })
})


const updateRiderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.riderId;
    const decodeToken = req.user as JwtPayload

    const riders = await RiderService.updateRiderStatus(id, req.body,decodeToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Updated status successfully",
        data: riders
    })
})


const updateCancel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.riderId;
    const decodeToken = req.user as JwtPayload

    const riders = await RiderService.updatedCancel(id, req.body,decodeToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Updated status successfully",
        data: riders
    })
})

const getAllRideHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const decodeToken = req.user as JwtPayload
console.log("ami matal",decodeToken);

    const riders = await RiderService.getAllRideHistory(decodeToken.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All riders retrieved successfully",
        data: riders.data,
        meta: riders.meta
    })
})

export const RiderController = {
    createRiderRequest,
    getAllRider,
    updateRiderAccept,
    updateRiderStatus,
    updateCancel,
    getAllRideHistory
}