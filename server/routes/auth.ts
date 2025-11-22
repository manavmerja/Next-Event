import express, { Request, Response } from "express" // 1. IMPORTED TYPES
import bcrypt from "bcryptjs"
import { body, validationResult } from "express-validator"
import User from "../models/User"
import { generateToken } from "../lib/auth"

const router = express.Router()

// POST /api/auth/signup
router.post(
  "/signup",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("studentId").trim().notEmpty().withMessage("Student ID is required"),
    body("department").trim().notEmpty().withMessage("Department is required"),
    body("phone").trim().notEmpty().withMessage("Phone is required"),
  ],
  // 2. APPLIED TYPES
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { fullName, email, password, studentId, department, phone } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" })
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10)

      // Create user
      const user = await User.create({
        fullName,
        email,
        passwordHash,
        studentId,
        department,
        phone,
        role: "student",
      })

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      })

      // --- COOKIE FIX ---
      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none", 
        path: "/", 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          bookmarks: user.bookmarks
        },
      })
    } catch (error) {
      console.error("Signup error:", error)
      res.status(500).json({ error: "Server error during signup" })
    }
  },
)

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  // 3. APPLIED TYPES
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { email, password } = req.body

      // Find user
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash)
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      })

      // --- COOKIE FIX ---
      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none", 
        path: "/", 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          bookmarks: user.bookmarks
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ error: "Server error during login" })
    }
  },
)

// POST /api/auth/logout
router.post("/logout", (req: Request, res: Response) => { // Yahaan bhi add karna accha hai
  // --- COOKIE FIX ---
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  })
  res.json({ message: "Logged out successfully" })
})

// GET /api/auth/me
router.get("/me", async (req: Request, res: Response) => { // Yahaan bhi add karna accha hai
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    const { verifyToken } = await import("../lib/auth")
    const decoded = verifyToken(token)

    const user = await User.findById(decoded.userId).select("-passwordHash")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    res.status(401).json({ error: "Invalid token" })
  }
})


// --- GITHUB OAUTH LOGIN ---
router.post("/github", async (req: Request, res: Response) => {
  const { code } = req.body
  
  // Secrets from .env
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

  try {
    // 1. Exchange Code for Access Token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = (await tokenResponse.json()) as any
    
    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description || "GitHub login failed" })
    }

    const accessToken = tokenData.access_token

    // 2. Fetch User Data from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const gitHubUser = (await userResponse.json()) as any

    // 3. Fetch Email (agar public profile par email hidden hai)
    let email = gitHubUser.email
    if (!email) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const emails = (await emailsResponse.json()) as any
      const primaryEmail = emails.find((e: any) => e.primary && e.verified)
      if (primaryEmail) email = primaryEmail.email
    }

    if (!email) {
      return res.status(400).json({ error: "No verifiable email found from GitHub" })
    }

    // 4. Find or Create User in DB
    let user = await User.findOne({ email })

    if (!user) {
      // User nahi hai -> Naya banao (Placeholders ke saath)
      user = await User.create({
        fullName: gitHubUser.name || gitHubUser.login,
        email: email,
        passwordHash: "github-oauth-linked-account", // Dummy password (login wont work with pass)
        studentId: `GH-${gitHubUser.id}`, // Placeholder ID
        department: "General",
        phone: "Not Provided",
        role: "student",
        bookmarks: [],
      })
    }

    // 5. Generate JWT Token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // 6. Set Secure Cookie (Same as normal login)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // 7. Send Success Response
    res.json({
      message: "GitHub login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        bookmarks: user.bookmarks,
      },
    })

  } catch (error) {
    console.error("GitHub Auth Error:", error)
    res.status(500).json({ error: "Server error during GitHub login" })
  }
})


export default router