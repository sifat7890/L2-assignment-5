import { Types } from "mongoose";




export enum isDriverStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED"
};

export interface IDriverInfo {
  userID: Types.ObjectId;
  approved: boolean;
  online: boolean;
  vehicle: string;
  earnings: number;
  driverStatus: isDriverStatus;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  currentRide?: Types.ObjectId | null;
}