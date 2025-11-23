
import { Parser } from "json2csv"
import express, { Request, Response } from "express"
import { authMiddleware, adminMiddleware } from "../lib/auth"
import Registration from "../models/Registration"
// We need to import these to ensure models are registered for population
import "../models/User"
import "../models/Event"

const router = express.Router()

// GET /api/admin/registrations - Get ALL registrations with User and Event details
router.get("/registrations", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const registrations = await Registration.find()
      .populate("userId", "fullName email studentId") // Get User details
      .populate("eventId", "title startsAt category") // Get Event details
      .sort({ registeredAt: -1 }) // Newest first

    res.json({ registrations })
  } catch (error) {
    console.error("Admin registrations error:", error)
    res.status(500).json({ error: "Server error fetching registrations" })
  }
})

// GET /api/admin/export - Download CSV of all registrations
router.get("/export", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    // 1. Data fetch karo
    const registrations = await Registration.find()
      .populate("userId", "fullName email studentId department phone")
      .populate("eventId", "title startsAt category")
      .sort({ registeredAt: -1 })

    // 2. Data ko flat object mein convert karo (CSV friendly format)
    const csvData = registrations.map((reg: any) => ({
      "Student Name": reg.userId?.fullName || "N/A",
      "Email": reg.userId?.email || "N/A",
      "Student ID": reg.userId?.studentId || "N/A",
      "Department": reg.userId?.department || "N/A",
      "Phone": reg.userId?.phone || "N/A",
      "Event Name": reg.eventId?.title || "N/A",
      "Event Category": reg.eventId?.category || "N/A",
      "Event Date": reg.eventId?.startsAt ? new Date(reg.eventId.startsAt).toLocaleDateString() : "N/A",
      "Registration Date": new Date(reg.registeredAt).toLocaleDateString(),
      "Status": reg.status
    }))

    // 3. JSON ko CSV string mein badlo
    const json2csvParser = new Parser()
    const csv = json2csvParser.parse(csvData)

    // 4. File bhejo (Headers set karke taaki download start ho)
    res.header('Content-Type', 'text/csv')
    res.attachment('registrations.csv') // Browser ko batao ki ye file hai
    return res.send(csv)

  } catch (error) {
    console.error("Export CSV error:", error)
    res.status(500).json({ error: "Server error exporting CSV" })
  }
})

export default router