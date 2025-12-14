import express, { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User"
import { authMiddleware } from "../lib/auth"

// TypeScript Interface
interface AuthRequest extends Request {
  user?: {
    userId: string
    role: string
  }
}

const router = express.Router()

const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })
}

// 1. SIGNUP
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, studentId, department, phone } = req.body
    
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ error: "Email already exists" })

    const passwordHash = await bcrypt.hash(password, 10)
    
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      studentId,
      department,
      phone,
      bookmarks: []
    })

    const token = generateToken({ userId: user._id, role: user.role })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({ 
      message: "User created", 
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, bookmarks: user.bookmarks } 
    })
  } catch (error) {
    res.status(500).json({ error: "Error creating user" })
  }
})

// 2. LOGIN
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = generateToken({ userId: user._id, role: user.role })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ 
      message: "Login successful", 
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, bookmarks: user.bookmarks } 
    })
  } catch (error) {
    res.status(500).json({ error: "Login failed" })
  }
})

// 3. GET ME (User Profile with Populated Bookmarks)
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // 👇 Change: .populate('bookmarks') add kiya
    const user = await User.findById(req.user?.userId)
      .select("-passwordHash")
      .populate("bookmarks") 
    
    if (!user) return res.status(404).json({ error: "User not found" })
    
    res.json({ user })
  } catch (error) {
    console.error("Me Error:", error) 
    res.status(500).json({ error: "Server error" })
  }
})

// 4. LOGOUT
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "none",
    path: "/"
  })
  res.json({ message: "Logged out" })
})

// 👇 5. TOGGLE BOOKMARK (NEW ROUTE) 👇
router.put("/bookmark/:eventId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params
    const userId = req.user!.userId

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: "User not found" })

    // Check if already bookmarked
    const index = user.bookmarks.indexOf(eventId as any)
    
    let isBookmarked = false
    if (index === -1) {
      user.bookmarks.push(eventId as any) // Add
      isBookmarked = true
    } else {
      user.bookmarks.splice(index, 1) // Remove
      isBookmarked = false
    }

    await user.save()
    
    res.json({ 
      message: isBookmarked ? "Event Saved" : "Event Removed", 
      bookmarks: user.bookmarks 
    })

  } catch (error) {
    console.error("Bookmark error:", error)
    res.status(500).json({ error: "Failed to update bookmark" })
  }
})
// 👆 ---------------------------- 👆

// 6. GITHUB LOGIN
router.post("/github", async (req: Request, res: Response) => {
  const { code } = req.body
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
    })

    const tokenData = (await tokenResponse.json()) as any
    if (tokenData.error) return res.status(400).json({ error: "GitHub login failed" })

    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const gitHubUser = (await userResponse.json()) as any

    let email = gitHubUser.email
    if (!email) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })
      const emails = (await emailsResponse.json()) as any
      email = emails.find((e: any) => e.primary && e.verified)?.email
    }

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({
        fullName: gitHubUser.name || gitHubUser.login,
        email: email,
        passwordHash: "github-oauth",
        studentId: `GH-${gitHubUser.id}`,
        role: "student",
        bookmarks: []
      })
    }

    const token = generateToken({ userId: user._id, role: user.role })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ message: "GitHub Login Success", user })

  } catch (error) {
    res.status(500).json({ error: "GitHub Auth Error" })
  }
})

export default router