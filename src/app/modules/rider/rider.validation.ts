import { z } from 'zod';
import { RIDE_STATUS } from './rider.interface';

export const createRideZodSchema = z.object({
    rider: z.string({ invalid_type_error: "Rider ID is required" }).min(1),
    driver: z.string().optional(),
    pickup: z.object({
        address: z.string({ invalid_type_error: "Pickup address is required" }).min(1),
        coordinates: z.object({
            lat: z.number({ invalid_type_error: "Pickup latitude is required" }),
            lng: z.number({ invalid_type_error: "Pickup longitude is required" }),
        }),
    }),
    destination: z.object({
        address: z.string({ invalid_type_error: "Destination address is required" }).min(1),
        coordinates: z.object({
            lat: z.number({ invalid_type_error: "Destination latitude is required" }),
            lng: z.number({ invalid_type_error: "Destination longitude is required" }),
        }),
    }),
    status: z.enum(Object.values(RIDE_STATUS) as [string]).optional(),
    fare: z.number().optional(),
});

export const updateRideZodSchema = z.object({
    status: z.enum(Object.values(RIDE_STATUS) as [string]).optional(),
    fare: z.number().optional(),
    timestamps: z.
        object({
            requestedAt: z.date().optional(),
            acceptedAt: z.date().optional(),
            pickedUpAt: z.date().optional(),
            completedAt: z.date().optional(),
            canceledAt: z.date().optional(),
        }).optional()
})