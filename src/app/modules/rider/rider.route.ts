import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema, updateRideZodSchema } from "./rider.validation";
import { RiderController } from "./rider.controller";

const router = Router()

// Rider routes
router.post("/request", checkAuth(Role.RIDER), validateRequest(createRideZodSchema), RiderController.createRiderRequest)

// Driver routes
router.get("/available", checkAuth(Role.DRIVER),  RiderController.getAllRider)
router.patch("/accept/:riderId", checkAuth(Role.DRIVER), validateRequest(updateRideZodSchema),  RiderController.updateRiderAccept)
router.patch("/status/:riderId", checkAuth(Role.DRIVER), validateRequest(updateRideZodSchema),  RiderController.updateRiderStatus)
router.patch("/cancel/:rideId", checkAuth(Role.DRIVER,Role.RIDER), validateRequest(updateRideZodSchema),  RiderController.updateCancel)
router.get("/history", checkAuth(Role.DRIVER,Role.RIDER),RiderController.getAllRideHistory)



export const RideRoutes = router