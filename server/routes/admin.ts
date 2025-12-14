import express, { Request, Response } from "express";
import { authMiddleware, adminMiddleware } from "../lib/auth";
import User from "../models/User";
import Event from "../models/Event";
import Registration from "../models/Registration";
import { Parser } from "json2csv";

// Types definition fix
interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const router = express.Router();

// 1. 📊 GET /api/admin/stats - Dashboard Counts
router.get("/stats", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ role: "student" });
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    res.json({
      totalUsers,
      totalEvents,
      totalRegistrations,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// 2. 📋 GET /api/admin/registrations - Recent Registrations Table
router.get("/registrations", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const registrations = await Registration.find()
      .populate("userId", "fullName email") // Student details
      .populate("eventId", "title")         // Event details
      .sort({ registeredAt: -1 })
      .limit(50); // Show only last 5 in dashboard widget

    res.json({ registrations });
  } catch (error) {
    console.error("Registrations Error:", error);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// 3. 📉 GET /api/admin/export - Download CSV
router.get("/export", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const registrations = await Registration.find()
      .populate("userId", "fullName email studentId department phone")
      .populate("eventId", "title startsAt category")
      .sort({ registeredAt: -1 });

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
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment('registrations.csv');
    return res.send(csv);

  } catch (error) {
    console.error("Export CSV error:", error);
    res.status(500).json({ error: "Server error exporting CSV" });
  }
});

// 4. 🔄 POST /api/admin/sync-ticketmaster - Sync External Events
router.post("/sync-ticketmaster", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const API_KEY = process.env.TICKETMASTER_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: "Ticketmaster API Key is missing in .env" });
    }

    // Fetch Data
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&size=20&sort=date,asc&classificationName=music,sports,arts`
    );
    
    if (!response.ok) {
      throw new Error(`Ticketmaster API Error: ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    const tmEvents = data._embedded?.events || [];

    // Loop & Save
    for (const ev of tmEvents) {
      
      // Category Mapping
      let category = "Other";
      const tmSegment = ev.classifications?.[0]?.segment?.name?.toLowerCase() || "";
      if (tmSegment.includes("sport")) category = "Sports";
      else if (tmSegment.includes("music") || tmSegment.includes("arts")) category = "Cultural";
      else if (tmSegment.includes("workshop")) category = "Seminar";

      // Image
      const image = ev.images?.find((img: any) => img.width > 600)?.url || ev.images?.[0]?.url || "";

      // Venue
      const venueObj = ev._embedded?.venues?.[0];
      const venueName = venueObj?.name || "Unknown Venue";
      const city = venueObj?.city?.name || "Unknown City";
      const lat = parseFloat(venueObj?.location?.latitude || "0");
      const long = parseFloat(venueObj?.location?.longitude || "0");

      const eventData = {
        title: ev.name,
        description: `Experience ${ev.name} live at ${venueName}. Book tickets via Ticketmaster.`,
        category,
        startsAt: new Date(ev.dates.start.dateTime || Date.now()),
        endsAt: new Date(ev.dates.start.dateTime || Date.now()),
        venue: venueName,
        locationText: `${venueName}, ${city}`,
        latitude: lat,
        longitude: long,
        bannerUrl: image,
        
        // Aggregator Fields
        isExternal: true,
        source: "Ticketmaster",
        externalUrl: ev.url,
        externalId: ev.id,
        
        createdBy: req.user!.userId, 
        rules: "Check official website for rules.",
        requirements: "Ticket required for entry.",
      };

      // Upsert
      await Event.findOneAndUpdate(
        { externalId: ev.id },
        eventData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.json({ 
      message: `Sync successful! Processed ${tmEvents.length} events from Ticketmaster.` 
    });

  } catch (error: any) {
    console.error("Sync Error:", error);
    res.status(500).json({ error: error.message || "Failed to sync events" });
  }
});

export default router;