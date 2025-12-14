import mongoose, { Schema, type Document } from "mongoose"

export interface IEvent extends Document {
  title: string
  description: string
  category: "Hackathon" | "Technical" | "Cultural" | "Sports" | "Webinar" | "Seminar" | "Other"
  startsAt: Date
  endsAt?: Date
  venue: string
  locationText: string
  latitude: number
  longitude: number
  bannerUrl: string
  rules?: string
  requirements?: string
  
  // --- 👇 NEW AGGREGATOR FIELDS INTERFACE 👇 ---
  isExternal: boolean
  externalUrl?: string
  source: string
  externalId?: string
  // -------------------------------------------

  createdBy: mongoose.Types.ObjectId
  createdAt: Date
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Hackathon", "Technical", "Cultural", "Sports", "Webinar", "Seminar", "Other"],
    required: true,
  },
  startsAt: {
    type: Date,
    required: true,
  },
  endsAt: {
    type: Date,
  },
  venue: {
    type: String,
    required: true,
    trim: true,
  },
  locationText: {
    type: String,
    required: true,
    trim: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  bannerUrl: {
    type: String,
    required: true,
  },

  // --- EXISTING FIELDS ---
  rules: { type: String, default: "" },        
  requirements: { type: String, default: "" }, 
  
  // --- 👇 NEW AGGREGATOR FIELDS SCHEMA 👇 ---
  isExternal: { 
    type: Boolean, 
    default: false 
  }, 
  externalUrl: { 
    type: String, 
    default: "" 
  },
  source: { 
    type: String, 
    default: "NextEvent" // "Ticketmaster", "Eventbrite", etc.
  },
  externalId: { 
    type: String, 
    unique: true, 
    sparse: true // Important: Allows internal events to have no externalId without error
  },
  // ------------------------------------------

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)