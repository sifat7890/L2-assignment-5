import z from "zod";
import { isDriverStatus } from "./driver.interface";


export const createDriverZodSchema = z.object({
    approved: z.boolean().optional(),
    online: z.boolean().optional(),
    vehicle: z
        .object({
            make: z.string().optional(),
            model: z.string().optional(),
            plate: z.string().optional(),
        })
    ,
    earnings: z.number().optional(),
    driverStatus: z.enum(Object.values(isDriverStatus) as [string]).optional(),
    location: z
        .object({
            type: z.literal("Point").optional(),
            coordinates: z
                .tuple([
                    z.number().min(-180).max(180),
                    z.number().min(-90).max(90)
                ])
                .optional()
        })
})
export const updateDriverZodSchema = z.object({
    approved: z.boolean().optional(),
    online: z.boolean().optional(),
    vehicle: z
        .object({
            make: z.string().optional(),
            model: z.string().optional(),
            plate: z.string().optional(),
        }).optional()
    ,
    earnings: z.number().optional(),
    driverStatus: z.enum(Object.values(isDriverStatus) as [string]).optional(),
    location: z
        .object({
            type: z.literal("Point").optional(),
            coordinates: z
                .tuple([
                    z.number().min(-180).max(180),
                    z.number().min(-90).max(90)
                ])

        }).optional()
})