/* eslint-disable @typescript-eslint/no-unused-vars */
import   httpStatus   from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { AuthService } from "./auth.service"
import { sendResponse } from "../../utils/sendResponse"
import { setAuthCookies } from '../../utils/setCookies';
import AppError from '../../errorHelpers/AppError';
import { JwtPayload } from 'jsonwebtoken';



const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

     
    const loginInfo = await AuthService.credentialsLogin(req.body)
        setAuthCookies(res, loginInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User login successfully",
        data: loginInfo
    })
}
)


const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
    }

    const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string)

    setAuthCookies(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New access token retrived successfully",
        data: tokenInfo
    })
}
)

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logout successfully",
        data: null
    })
}
)

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user


    await AuthService.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed successfully successfully",
        data: null
    })
}
)


export const AuthControllers ={
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
}