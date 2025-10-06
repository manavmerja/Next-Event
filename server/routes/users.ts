import express from "express"
import Registration from "../models/Registration"
import { authMiddleware, type AuthRequest } from "../lib/auth"

const router = express.Router()

// GET /api/users/me/registrations - Get user's registrations
router.get("/me/registrations", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const registrations = await Registration.find({
      userId: req.user!.userId,
      status: "registered",
    })
      .populate("eventId")
      .sort({ registeredAt: -1 })

    res.json({ registrations })
  } catch (error) {
    console.error("Get registrations error:", error)
    res.status(500).json({ error: "Server error fetching registrations" })
  }
})

export default router
