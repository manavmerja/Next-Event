"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CustomCursor } from "@/components/custom-cursor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { eventsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const categories = ["Hackathon", "Technical", "Cultural", "Sports", "Webinar", "Seminar", "Other"]

export default function CreateEventPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startsAt: "",
    endsAt: "",
    venue: "",
    locationText: "",
    latitude: "",
    longitude: "",
    bannerUrl: "",
  })

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/")
      toast({
        title: "Access Denied",
        description: "Only admins can create events",
        variant: "destructive",
      })
    }
  }, [user, authLoading, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const eventData = {
        ...formData,
        // 1. Make Lat/Lng optional (Default to 0 if empty)
        latitude: formData.latitude ? Number.parseFloat(formData.latitude) : 0,
        longitude: formData.longitude ? Number.parseFloat(formData.longitude) : 0,
      }

      await eventsAPI.create(eventData)
      toast({
        title: "Success!",
        description: "Event created successfully",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Failed to create event",
        description: error.message || "Could not create event",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user || user.role !== "admin") {
    return null
  }

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 bg-gradient-to-b from-black to-[#061823] py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="border-[#a56aff]/20 bg-black/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-3xl bg-gradient-to-r from-[#a56aff] to-purple-400 bg-clip-text text-transparent">
                    Create New Event
                  </CardTitle>
                  <CardDescription>Fill in the details to create a new event</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="HackFest 2025"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="bg-black/30 border-[#a56aff]/30 focus:border-[#a56aff]"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your event..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={4}
                        className="bg-black/30 border-[#a56aff]/30 focus:border-[#a56aff]"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="bg-black/30 border-[#a56aff]/30 focus:border-[#a56aff]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startsAt">Start Date & Time *</Label>
                        <Input
                          id="startsAt"
                          type="datetime-local"
                          value={formData.startsAt}
                          onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                          required
                          // 2. Added 'dark:[color-scheme:dark]' to fix icon visibility
                          className="bg-black/30 border-[#a56aff]/30 focus:border-[#a56aff] dark:[color-scheme:dark]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endsAt">End Date & Time</Label>
                        <Input
                          id="endsAt"
                          type="datetime-local"
                          value={formData.endsAt}
                          onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                          // 2. Added 'dark:[color-scheme:dark]' to fix icon visibility
                          className="bg-black/30 border-[#a56aff]/30 focus:border-[#a56aff] dark:[color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue *</Label>
                      <Input
                        id="venue"
                        type="text"
                        placeholder="Tech Hub Auditorium"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        required
                        className="bg-black/30 border-[#a56aff]/30 focus:border-[#a56aff]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locationText">Location Details *</Label>
                      <Input
                        id="locationText"
                        type="text"
                        placeholder="Building A, 3rd Floor"
                        value={formData.locationText}
                        onChange={(e) => setFormData({ ...formData, locationText: e.target.value })}
                        required
                        className="bg-black/30 border-[#a56aff]/30 focus:border-[#a56aff]"
                      />
                    </div>

                    {/* Coordinates (Now Optional) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude (Optional)</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="any"
                          placeholder="40.7128"
                          value={formData.latitude}
                          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                          // 3. Removed 'required'
                          className="bg-black/30 border-[#a56aff]/30 focus:border-[#a56aff]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude (Optional)</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          placeholder="-74.0060"
                          value={formData.longitude}
                          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                          // 3. Removed 'required'
                          className="bg-black/30 border-[#a56aff]/30 focus:border-[#a56aff]"
                        />
                      </div>
                    </div>

                    {/* Banner URL */}
                    <div className="space-y-2">
                      <Label htmlFor="bannerUrl">Banner Image URL *</Label>
                      <Input
                        id="bannerUrl"
                        type="url"
                        placeholder="https://example.com/banner.jpg"
                        value={formData.bannerUrl}
                        onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                        required
                        className="bg-black/30 border-[#a56aff]/30 focus:border-[#a56aff]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tip: Use /placeholder.svg for testing or upload to an image hosting service
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="flex-1 bg-[#a56aff] hover:bg-[#a56aff]/90" disabled={loading}>
                        {loading ? "Creating..." : "Create Event"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[#a56aff]/30 bg-transparent"
                        onClick={() => router.push("/dashboard")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}