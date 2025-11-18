import express, { Request, Response } from "express"
import { body, query, validationResult } from "express-validator"
import Event from "../models/Event"
import Registration from "../models/Registration"
import { authMiddleware, adminMiddleware, type AuthRequest } from "../lib/auth"

const router = express.Router()

// GET /api/events - List events with filters
router.get(
  "/",
  [
    query("category").optional().isString(),
    query("search").optional().isString(),
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  async (req: Request, res: Response) => {
    try {
      const { category, search, page = 1, limit = 12 } = req.query
      const skip = (Number(page) - 1) * Number(limit)

      // Build query
      const query: any = {}
      if (category) {
        query.category = category
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { locationText: { $regex: search, $options: "i" } },
        ]
      }

      const [events, total] = await Promise.all([
        Event.find(query).sort({ startsAt: 1 }).skip(skip).limit(Number(limit)).populate("createdBy", "fullName email"),
        Event.countDocuments(query),
      ])

      res.json({
        events,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      })
    } catch (error) {
      console.error("Get events error:", error)
      res.status(500).json({ error: "Server error fetching events" })
    }
  },
)

// GET /api/events/:id - Get event details
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "fullName email")

    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    res.json({ event })
  } catch (error) {
    console.error("Get event error:", error)
    res.status(500).json({ error: "Server error fetching event" })
  }
})

// POST /api/events - Create event (admin only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("category").isIn(["Hackathon", "Technical", "Cultural", "Sports", "Webinar", "Seminar", "Other"]),
    body("startsAt").isISO8601().withMessage("Valid start date is required"),
    body("venue").trim().notEmpty().withMessage("Venue is required"),
    body("locationText").trim().notEmpty().withMessage("Location text is required"),
    body("latitude").isFloat().withMessage("Valid latitude is required"),
    body("longitude").isFloat().withMessage("Valid longitude is required"),
    body("bannerUrl").trim().notEmpty().withMessage("Banner URL is required"),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const event = await Event.create({
        ...req.body,
        createdBy: req.user!.userId,
      })

      res.status(201).json({ message: "Event created successfully", event })
    } catch (error) {
      console.error("Create event error:", error)
      res.status(500).json({ error: "Server error creating event" })
    }
  },
)

// PUT /api/events/:id - Update event (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true })

    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    res.json({ message: "Event updated successfully", event })
  } catch (error) {
    console.error("Update event error:", error)
    res.status(500).json({ error: "Server error updating event" })
  }
})

// DELETE /api/events/:id - Delete event (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)

    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    // Also delete all registrations for this event
    await Registration.deleteMany({ eventId: req.params.id })

    res.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Delete event error:", error)
    res.status(500).json({ error: "Server error deleting event" })
  }
})

// POST /api/events/:id/register - Register for event
router.post("/:id/register", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      userId: req.user!.userId,
      eventId: req.params.id,
      status: "registered",
    })

    if (existingRegistration) {
      return res.status(400).json({ error: "Already registered for this event" })
    }

    const registration = await Registration.create({
      userId: req.user!.userId,
      eventId: req.params.id,
      status: "registered",
    })

    res.status(201).json({ message: "Successfully registered for event", registration })
  } catch (error) {
    console.error("Register event error:", error)
    res.status(500).json({ error: "Server error registering for event" })
  }
})

// DELETE /api/events/:id/register - Cancel registration
router.delete("/:id/register", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const registration = await Registration.findOneAndUpdate(
      {
        userId: req.user!.userId,
        eventId: req.params.id,
        status: "registered",
      },
      { status: "cancelled" },
      { new: true },
    )

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" })
    }

    res.json({ message: "Registration cancelled successfully" })
  } catch (error) {
    console.error("Cancel registration error:", error)
    res.status(500).json({ error: "Server error cancelling registration" })
  }
})

// --- NEW BOOKMARK ROUTE ---
// POST /api/events/:id/bookmark - Toggle bookmark status
router.post("/:id/bookmark", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const eventId = req.params.id
    const userId = req.user!.userId

    // Dynamically import User model to avoid circular dependencies if any
    const User = (await import("../models/User")).default
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Initialize bookmarks array if it doesn't exist
    if (!user.bookmarks) {
      user.bookmarks = []
    }

    // Check if already bookmarked
    // Note: user.bookmarks contains ObjectIds, so we compare string versions
    const bookmarkIndex = user.bookmarks.findIndex((id: any) => id.toString() === eventId)

    if (bookmarkIndex === -1) {
      // Not bookmarked -> Add it
      user.bookmarks.push(eventId)
      await user.save()
      res.json({ message: "Event bookmarked", isBookmarked: true })
    } else {
      // Already bookmarked -> Remove it
      user.bookmarks.splice(bookmarkIndex, 1)
      await user.save()
      res.json({ message: "Bookmark removed", isBookmarked: false })
    }
  } catch (error) {
    console.error("Bookmark error:", error)
    res.status(500).json({ error: "Server error toggling bookmark" })
  }
})

export default router