import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  fullName: string
  email: string
  passwordHash: string
  studentId: string
  department: string
  phone: string
  role: "student" | "admin"
  bookmarks: mongoose.Types.ObjectId[] // 👈 Array of Event IDs
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  studentId: { type: String, default: "Not Provided" },
  department: { type: String, default: "General" },
  phone: { type: String, default: "Not Provided" },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  
  // 👇 NEW FIELD ADDED
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Event", default: [] }], 
  
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)