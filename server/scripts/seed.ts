import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import User from "../models/User"
import Event from "../models/Event"

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ""

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Event.deleteMany({})
    console.log("Cleared existing data")

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = await User.create({
      fullName: "Admin User",
      email: "admin@nextevent.com",
      passwordHash: adminPassword,
      studentId: "ADMIN001",
      department: "Administration",
      phone: "+1234567890",
      role: "admin",
    })
    console.log("Created admin user:", admin.email)

    // Create sample student
    const studentPassword = await bcrypt.hash("student123", 10)
    const student = await User.create({
      fullName: "John Doe",
      email: "student@nextevent.com",
      passwordHash: studentPassword,
      studentId: "STU001",
      department: "Computer Science",
      phone: "+1234567891",
      role: "student",
    })
    console.log("Created student user:", student.email)

    // Create sample events
    const events = [
      {
        title: "HackFest 2025",
        description:
          "Join us for the biggest hackathon of the year! Build innovative solutions, network with industry experts, and compete for amazing prizes.",
        category: "Hackathon",
        startsAt: new Date("2025-02-15T09:00:00"),
        endsAt: new Date("2025-02-17T18:00:00"),
        venue: "Tech Hub Auditorium",
        locationText: "Building A, 3rd Floor",
        latitude: 40.7128,
        longitude: -74.006,
        bannerUrl: "/hackathon-event-banner.jpg",
        createdBy: admin._id,
      },
      {
        title: "AI & Machine Learning Workshop",
        description:
          "Learn the fundamentals of AI and ML from industry professionals. Hands-on sessions with real-world projects.",
        category: "Technical",
        startsAt: new Date("2025-02-20T14:00:00"),
        endsAt: new Date("2025-02-20T17:00:00"),
        venue: "Computer Lab 101",
        locationText: "Engineering Block",
        latitude: 40.758,
        longitude: -73.9855,
        bannerUrl: "/ai-workshop-banner.jpg",
        createdBy: admin._id,
      },
      {
        title: "Cultural Night 2025",
        description: "Experience diverse cultures through music, dance, and food. A celebration of unity in diversity.",
        category: "Cultural",
        startsAt: new Date("2025-03-01T18:00:00"),
        endsAt: new Date("2025-03-01T22:00:00"),
        venue: "Main Auditorium",
        locationText: "Campus Center",
        latitude: 40.7489,
        longitude: -73.968,
        bannerUrl: "/cultural-night-event.jpg",
        createdBy: admin._id,
      },
      {
        title: "Annual Sports Meet",
        description: "Inter-department sports competition featuring cricket, football, basketball, and more!",
        category: "Sports",
        startsAt: new Date("2025-03-10T08:00:00"),
        endsAt: new Date("2025-03-12T18:00:00"),
        venue: "Sports Complex",
        locationText: "Main Campus Grounds",
        latitude: 40.7614,
        longitude: -73.9776,
        bannerUrl: "/sports-meet-banner.jpg",
        createdBy: admin._id,
      },
      {
        title: "Web Development Bootcamp",
        description:
          "Master modern web development with React, Next.js, and TypeScript. Build production-ready applications.",
        category: "Webinar",
        startsAt: new Date("2025-02-25T10:00:00"),
        endsAt: new Date("2025-02-25T16:00:00"),
        venue: "Online (Zoom)",
        locationText: "Virtual Event",
        latitude: 40.7128,
        longitude: -74.006,
        bannerUrl: "/web-development-bootcamp.png",
        createdBy: admin._id,
      },
      {
        title: "Career Guidance Seminar",
        description:
          "Get insights from industry leaders about career paths, interview tips, and professional development.",
        category: "Seminar",
        startsAt: new Date("2025-03-05T15:00:00"),
        endsAt: new Date("2025-03-05T17:30:00"),
        venue: "Seminar Hall B",
        locationText: "Academic Block",
        latitude: 40.7282,
        longitude: -74.0776,
        bannerUrl: "/career-seminar-banner.jpg",
        createdBy: admin._id,
      },
    ]

    await Event.insertMany(events)
    console.log(`Created ${events.length} sample events`)

    console.log("\n✅ Seed completed successfully!")
    console.log("\nTest Credentials:")
    console.log("Admin - Email: admin@nextevent.com, Password: admin123")
    console.log("Student - Email: student@nextevent.com, Password: student123")

    await mongoose.disconnect()
  } catch (error) {
    console.error("Seed error:", error)
    process.exit(1)
  }
}

seed()
