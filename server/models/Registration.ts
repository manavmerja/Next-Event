import mongoose, { Schema, type Document } from "mongoose"

export interface IRegistration extends Document {
  userId: mongoose.Types.ObjectId
  eventId: mongoose.Types.ObjectId
  status: "registered" | "cancelled"
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
    enum: ["registered", "cancelled"],
    default: "registered",
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound unique index to prevent duplicate registrations
RegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true })

export default mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema)
