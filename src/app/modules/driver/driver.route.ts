import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DriverController } from "./driver.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDriverZodSchema, updateDriverZodSchema } from "./driver.validation";



const router =Router()

router.post("/createDriver",checkAuth(Role.DRIVER),  validateRequest(createDriverZodSchema),DriverController.createDriver)

// Admin route
router.get('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DriverController.getAllDriver );
router.patch('/driver-status/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateDriverZodSchema), DriverController.updateDriverStatus );
 


export const DriverRoutes= router