/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken"
import { UserServices } from "../user/user.service"
import { DriverService } from "./driver.service"


const createDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodeToken = req.user as JwtPayload

    const driver = await DriverService.createDriver(req.body, decodeToken.userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Driver created successfully",
        data: driver
    })
}
)


const getAllDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const drivers = await DriverService.getAllDriver();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All Users retrieved successfully",
        data: drivers.data,
        meta: drivers.meta
    })
})

const updateDriverStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;


    const drivers = await DriverService.updateDriverStatus(id, req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Updated approval successfully",
        data: drivers
    })
})


export const DriverController = {
    createDriver,
    getAllDriver,
    updateDriverStatus
}