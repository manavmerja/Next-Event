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
const PORT = process.env.PORT || 3001

// Connect to MongoDB
connectDB()

// --- THIS IS THE UPDATED SECTION ---

// List of allowed URLs (origins)
const allowedOrigins = [
  "http://localhost:3000",
  "https://v0-event-aggregator-web-app.vercel.app/" // <-- ⚠️ REPLACE THIS WITH YOUR VERCEL URL
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      // Check if the incoming origin is in our allowed list
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
)

// --- END OF UPDATED SECTION ---

app.use(express.json())
app.use(cookieParser())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use("/api/", limiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/users", userRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server error:", err)
  res.status(500).json({ error: "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})