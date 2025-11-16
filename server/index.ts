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
  "https://v0-event-aggregator-web-app.vercel.app" // <-- ⚠️ YAHAN SE SLASH HATA DIYA HAI
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // 'origin' is the URL of the frontend (your Vercel site)
      
      // 1. If the origin is in our list, allow it.
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // 2. If it's NOT in the list, LOG IT and then reject it.
        console.error(`REJECTED ORIGIN: ${origin}`); // <-- THIS IS THE NEW DEBUG LINE
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        callback(new Error(msg), false);
      }
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