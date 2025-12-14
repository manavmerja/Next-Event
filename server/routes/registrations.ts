import express, { Request, Response } from "express"
import Registration from "../models/Registration"
import { authMiddleware } from "../lib/auth"

// Fix for TypeScript req.user
interface AuthRequest extends Request {
  user?: {
    userId: string
    role: string
  }
}

const router = express.Router()

// 1. REGISTER FOR EVENT (POST /)
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.body
    const userId = req.user!.userId

    // Check if already registered
    const existing = await Registration.findOne({ userId, eventId })
    if (existing) {
      return res.status(400).json({ error: "Already registered for this event" })
    }

    // Create Registration
    const registration = await Registration.create({
      userId,
      eventId,
      status: "confirmed", // Default confirmed
      registeredAt: new Date(),
    })

    res.status(201).json({ message: "Registration successful", registration })
  } catch (error) {
    console.error("Registration Error:", error)
    res.status(500).json({ error: "Registration failed" })
  }
})

// 2. GET MY REGISTRATIONS (GET /my) -> For Dashboard
router.get("/my", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const registrations = await Registration.find({ userId: req.user!.userId })
      .populate("eventId") // Event details bhi chahiye (Title, Date, Venue)
      .sort({ registeredAt: -1 })

    res.json({ registrations })
  } catch (error) {
    console.error("My Registrations Error:", error)
    res.status(500).json({ error: "Failed to fetch registrations" })
  }
})

// 3. CHECK REGISTRATION STATUS (GET /status/:eventId)
router.get("/status/:eventId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params
    const registration = await Registration.findOne({ 
      userId: req.user!.userId, 
      eventId 
    })

    res.json({ isRegistered: !!registration })
  } catch (error) {
    res.status(500).json({ error: "Status check failed" })
  }
})

export default router