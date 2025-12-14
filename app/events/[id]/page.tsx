"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  Bookmark, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink // 👈 Import ExternalLink
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReviewsSection } from "@/components/reviews-section"
import { EventDetailSkeleton } from "@/components/loading-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CustomCursor } from "@/components/custom-cursor"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
// 👇 New Imports for Dialog & Input
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
// ------------------------------
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { eventsAPI } from "@/lib/api"
import dynamic from "next/dynamic"

const EventMap = dynamic(() => import("@/components/event-map"), { ssr: false })

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  // 👇 New State for Dialog
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsAPI.getById(params.id as string)
        setEvent(data.event)
      } catch (error) {
        console.error("Failed to fetch event:", error)
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, toast])

  const handleRegister = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setRegistering(true)
    try {
      await eventsAPI.register(params.id as string)
      setIsRegistered(true)
      setIsRegisterOpen(false) // 👈 Close dialog on success
      toast({
        title: "Success!",
        description: "You have successfully registered for this event",
      })
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not register for event",
        variant: "destructive",
      })
    } finally {
      setRegistering(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Event link copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <>
        <CustomCursor />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1 py-12 bg-gradient-to-b from-black to-[#061823]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <EventDetailSkeleton />
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  if (!event) {
    return (
      <>
        <CustomCursor />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Event not found</h2>
              <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist</p>
              <Button onClick={() => router.push("/events")}>Back to Events</Button>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  const eventDate = new Date(event.startsAt)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 bg-gradient-to-b from-black to-[#061823]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Banner Image */}
              <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
                <Image src={event.bannerUrl || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-black/50 backdrop-blur-sm hover:bg-black/70"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-black/50 backdrop-blur-sm hover:bg-black/70">
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <Badge className="mb-3 bg-[#a56aff]/20 text-[#a56aff] border-[#a56aff]/30">{event.category}</Badge>
                    <h1 className="text-4xl font-bold mb-4 text-balance">{event.title}</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">{event.description}</p>
                  </div>

                  {/* --- RULES & REQUIREMENTS SECTIONS --- */}
                  {event.rules && (
                    <div className="p-6 rounded-xl bg-red-900/10 border border-red-500/20 backdrop-blur-sm">
                      <h3 className="text-xl font-semibold text-red-400 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Rules & Regulations
                      </h3>
                      <p className="text-gray-300 whitespace-pre-line leading-relaxed">{event.rules}</p>
                    </div>
                  )}

                  {event.requirements && (
                    <div className="p-6 rounded-xl bg-blue-900/10 border border-blue-500/20 backdrop-blur-sm">
                      <h3 className="text-xl font-semibold text-blue-400 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Prerequisites & Requirements
                      </h3>
                      <p className="text-gray-300 whitespace-pre-line leading-relaxed">{event.requirements}</p>
                    </div>
                  )}

                  {/* Map */}
                  <Card className="border-[#a56aff]/20 bg-black/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      <EventMap latitude={event.latitude} longitude={event.longitude} title={event.title} />
                    </CardContent>
                  </Card>
                  
                  {/* Reviews Section */}
                  <ReviewsSection eventId={event._id} />
                  
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Registration Card */}
                  <Card className="border-[#a56aff]/20 bg-black/50 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-5 w-5 text-[#a56aff] mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-medium">{formattedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-[#a56aff] mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Time</p>
                            <p className="font-medium">{formattedTime}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-[#a56aff] mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{event.venue}</p>
                            <p className="text-sm text-muted-foreground">{event.locationText}</p>
                          </div>
                        </div>
                      </div>

                      {/* 👇 MODIFIED BUTTON / DIALOG LOGIC START 👇 */}
                      <div className="pt-4">
                        {event.isExternal ? (
                          // CASE 1: External Event (Ticketmaster)
                          <Button 
                            className="w-full bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300"
                            onClick={() => window.open(event.externalUrl, "_blank")}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Book on {event.source || "External Site"}
                          </Button>
                        ) : (
                          // CASE 2: Internal Event (Registration Dialog)
                          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                            <DialogTrigger asChild>
                              <Button
                                className="w-full bg-[#a56aff] hover:bg-[#a56aff]/90"
                                size="lg"
                                disabled={isRegistered}
                              >
                                {isRegistered ? "Registered" : "Register Now"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1a1a1a] border-[#a56aff]/20 text-white">
                              <DialogHeader>
                                <DialogTitle>Register for {event.title}</DialogTitle>
                                <DialogDescription>
                                  Confirm your registration details below.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                                    <Input value={user?.fullName || ""} disabled className="bg-black/50 border-gray-800" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Email</label>
                                    <Input value={user?.email || ""} disabled className="bg-black/50 border-gray-800" />
                                  </div>
                              </div>
                              
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsRegisterOpen(false)} className="border-gray-700 hover:bg-gray-800">
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleRegister} 
                                  disabled={registering}
                                  className="bg-[#a56aff] hover:bg-[#a56aff]/90"
                                >
                                  {registering ? "Confirming..." : "Confirm Registration"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                      {/* 👆 MODIFIED LOGIC END 👆 */}

                      {!user && (
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          You need to be logged in to register
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Organizer Info */}
                  <Card className="border-[#a56aff]/20 bg-black/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Users className="h-5 w-5 text-[#a56aff] mr-2" />
                        Organized By
                      </h3>
                      <p className="text-sm">{event.source === "Ticketmaster" ? "Ticketmaster" : event.createdBy?.fullName || "Event Organizer"}</p>
                      <p className="text-xs text-muted-foreground">
                         {event.source === "Ticketmaster" ? "Verified Partner" : event.createdBy?.email}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}