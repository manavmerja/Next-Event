import express, { Request, Response } from "express"
import Review from "../models/Review"
import { authMiddleware } from "../lib/auth"

interface AuthRequest extends Request {
  user?: { userId: string; role: string }
}

const router = express.Router()

// 1. Get Reviews for an Event
router.get("/event/:eventId", async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ eventId: req.params.eventId })
      .populate("userId", "fullName")
      .sort({ createdAt: -1 })
    res.json({ reviews })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" })
  }
})

// 2. Add a Review
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, rating, comment } = req.body
    const userId = req.user!.userId

    const review = await Review.create({
      userId,
      eventId,
      rating,
      comment
    })

    // Populate user details immediately to show in UI
    await review.populate("userId", "fullName")

    res.status(201).json({ message: "Review added", review })
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" })
  }
})

export default router