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
  "https://v0-event-aggregator-web-app.vercel.app" // YEH AAPKI ASLI URL HAI
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
        // 2. If it's NOT in the list, LOG IT and then REJECT IT (bina crash kiye).
        console.error(`REJECTED ORIGIN: ${origin}`);
        
        // --- YEH LINE CHANGE HUI HAI ---
        callback(null, false); // Humne 'new Error(msg)' ko 'null' se badal diya
      }
    },
    credentials: true,
  }),
)

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