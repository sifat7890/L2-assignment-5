import { Schema, model } from 'mongoose';
import { IRide, RIDE_STATUS } from './rider.interface';


const RideSchema = new Schema<IRide>({
    rider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: Schema.Types.ObjectId, ref: 'User' },
    pickup: {
        address: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    },
    destination: {
        address: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    },
    status: {
        type: String,
        enum: Object.values(RIDE_STATUS),
        default: RIDE_STATUS.REQUESTED
    },
    fare: { type: Number },
    timestamps: {
        requestedAt: { type: Date, default: Date.now },
        acceptedAt: { type: Date},
        pickedUpAt: { type: Date},
        completedAt: { type: Date},
        canceledAt: { type: Date}
    }
}, { timestamps: true });


export const Ride = model<IRide>('Ride', RideSchema);