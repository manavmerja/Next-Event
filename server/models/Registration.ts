import mongoose, { Schema, type Document } from "mongoose"

export interface IRegistration extends Document {
  userId: mongoose.Types.ObjectId
  eventId: mongoose.Types.ObjectId
  status: "confirmed" | "cancelled" | "pending"
  registeredAt: Date
}

const RegistrationSchema = new Schema<IRegistration>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "confirmed",
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
})

// Unique compound index: Ek user ek event mein ek hi baar register kar sakta hai
RegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true })

export default mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema)