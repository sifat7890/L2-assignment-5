import { model, Schema } from "mongoose";
import { IDriverInfo, isDriverStatus } from "./driver.interface";

export const driverInfoSchema = new Schema<IDriverInfo>({
  userID:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  approved: { type: Boolean, default: false },
  online: { type: Boolean, default: false },
  vehicle: {
    make: String,
    model: String,
    plate: String,
  },
  earnings: { type: Number, default: 0 },
  driverStatus: {
    type: String,
    enum: Object.values(isDriverStatus),
    default: isDriverStatus.PENDING,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],  
      
    }
  },
  currentRide: { type: Schema.Types.ObjectId, ref: "Ride", default: null },
}
);

export const Driver = model<IDriverInfo>("Driver", driverInfoSchema)