
import adminRoutes from "./routes/admin"
import 'dotenv/config';
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import connectDB from "./lib/db"
import authRoutes from "./routes/auth"
import eventRoutes from "./routes/events"
import userRoutes from "./routes/users"

const app = express()

// Tell Express to trust the first proxy (Render's proxy)
app.set('trust proxy', 1); 

const PORT = process.env.PORT || 3001

// Connect to MongoDB
connectDB()

// List of allowed URLs (origins)
const allowedOrigins = [
  "http://localhost:3000",
  "https://v0-event-aggregator-web-app.vercel.app" // Make sure this is your correct URL
];

// --- MIDDLEWARE SECTION ---

// 1. Basic middleware (CORS, JSON, Cookies)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.error(`REJECTED ORIGIN: ${origin}`);
        callback(null, false); // Fixed: Doesn't crash server
      }
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// 2. Health Check Route (Moved BEFORE Rate Limiter)
// This ensures our health check is never rate-limited
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// 3. Rate Limiting (Applied to all other /api/ routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use("/api/", limiter) // This will now apply to auth, events, and users

// 4. Main API Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)

// 5. Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server error:", err)
  res.status(500).json({ error: "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})