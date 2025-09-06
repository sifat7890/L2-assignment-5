import { Types } from 'mongoose';

export enum RIDE_STATUS {
    REQUESTED = "REQUESTED",
    ACCEPTED = "ACCEPTED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export interface IRide {
    rider: Types.ObjectId;
    driver?: Types.ObjectId;
    pickup: {
        address: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    destination: {
        address: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    status: RIDE_STATUS;
    fare?: number;
    timestamps: {
        requestedAt: Date;
        acceptedAt?: Date;
        pickedUpAt?: Date;
        completedAt?: Date;
        canceledAt?: Date;
    };
}