import express, { Request, Response } from "express"
import { authMiddleware, adminMiddleware } from "../lib/auth"
import Registration from "../models/Registration"
// We need to import these to ensure models are registered for population
import "../models/User"
import "../models/Event"

const router = express.Router()

// GET /api/admin/registrations - Get ALL registrations with User and Event details
router.get("/registrations", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const registrations = await Registration.find()
      .populate("userId", "fullName email studentId") // Get User details
      .populate("eventId", "title startsAt category") // Get Event details
      .sort({ registeredAt: -1 }) // Newest first

    res.json({ registrations })
  } catch (error) {
    console.error("Admin registrations error:", error)
    res.status(500).json({ error: "Server error fetching registrations" })
  }
})

export default router