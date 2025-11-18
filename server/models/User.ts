import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  fullName: string
  email: string
  passwordHash: string
  studentId: string
  department: string
  phone: string
  role: "student" | "admin"
  // --- NEW FIELD ---
  bookmarks: mongoose.Types.ObjectId[]
  // -----------------
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  // --- NEW FIELD DEFINITION ---
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  // ----------------------------
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)