import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    // 1. Link to User: Kisne review diya?
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Yeh "User" model se juda hai
      required: true,
    },
    
    // 2. Link to Event: Kis event ka review hai?
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Yeh "Event" model se juda hai
      required: true,
    },
    
    // 3. Data: Kitne stars? (1 se 5)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    
    // 4. Data: Kya likha hai?
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // CreatedAt automatic aa jayega
)

// 🧠 Smart Rule (Compound Index):
// Ek User, Ek Event par sirf EK hi review de sakta hai.
// Aisa nahi hona chahiye ki maine ek hi event par 50 baar review de diya.
reviewSchema.index({ userId: 1, eventId: 1 }, { unique: true })

export default mongoose.models.Review || mongoose.model("Review", reviewSchema)