import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"

// Routes Imports
import authRoutes from "./routes/auth"
import eventRoutes from "./routes/events"
import adminRoutes from "./routes/admin"
import registrationRoutes from "./routes/registrations"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// 👇 FIX: CORS Configuration Updated
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://next-event-st.vercel.app",
      "https://v0-event-aggregator-web-app.vercel.app", // 👈 NEW URL ADDED HERE (From your error log)
      process.env.FRONTEND_URL || "", 
    ],
    credentials: true, // Cookies allow karne ke liye zaroori hai
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use(express.json())
app.use(cookieParser())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/registrations", registrationRoutes)

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" })
})

// Self Ping Logic
const SERVER_URL = "https://next-event-backend.onrender.com/api/health";
const keepAlive = () => {
  if (process.env.NODE_ENV === 'production') {
    fetch(SERVER_URL).catch(err => console.error(`Self-Ping Error: ${err.message}`));
  }
};
setInterval(keepAlive, 4 * 60 * 1000); 

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})