import express, { Request, Response } from "express"
import { authMiddleware, adminMiddleware, type AuthRequest } from "../lib/auth"
import User from "../models/User"
import Registration from "../models/Registration"

const router = express.Router()

// --- USER-FACING ROUTE (Already Exists) ---

// GET /api/users/me/registrations - Get current user's registrations
router.get("/me/registrations", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const registrations = await Registration.find({ userId: req.user!.userId }).populate({
      path: "eventId",
      model: "Event",
    })
    res.json({ registrations })
  } catch (error) {
    console.error("Get registrations error:", error)
    res.status(500).json({ error: "Server error fetching registrations" })
  }
})

// --- ADMIN-ONLY ROUTES (New) ---

// GET /api/users - Get all users (Admin Only)
router.get("/", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 })
    res.json({ users })
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({ error: "Server error fetching users" })
  }
})

// PATCH /api/users/:id - Update a user's role (Admin Only)
router.patch("/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { role } = req.body
    if (role !== "admin" && role !== "student") {
      return res.status(400).json({ error: "Invalid role" })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { role: role } },
      { new: true }
    ).select("-passwordHash")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json({ message: "User role updated", user })
  } catch (error) {
    console.error("Update user role error:", error)
    res.status(500).json({ error: "Server error updating user role" })
  }
})

// DELETE /api/users/:id - Delete a user (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    // Also delete their registrations
    await Registration.deleteMany({ userId: req.params.id })
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ error: "Server error deleting user" })
  }
})

export default router