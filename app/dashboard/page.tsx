"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Ticket, UserIcon, Plus } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { EventCardSkeleton } from "@/components/loading-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CustomCursor } from "@/components/custom-cursor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { usersAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return

      try {
        const data = await usersAPI.getMyRegistrations()
        setRegistrations(data.registrations)
      } catch (error) {
        console.error("Failed to fetch registrations:", error)
        toast({
          title: "Error",
          description: "Failed to load your registrations",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [user, toast])

  if (authLoading || !user) {
    return null
  }

  // --- FIX IS HERE ---
  // We add 'reg.eventId &&' to both filters.
  // This checks if 'reg.eventId' exists (is not null) *before* trying to access 'reg.eventId.startsAt'
  const upcomingEvents = registrations.filter((reg) => reg.eventId && new Date(reg.eventId.startsAt) > new Date())
  const pastEvents = registrations.filter((reg) => reg.eventId && new Date(reg.eventId.startsAt) <= new Date())
  // --- END OF FIX ---

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 bg-gradient-to-b from-black to-[#061823]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-[#a56aff] to-purple-400 bg-clip-text text-transparent">
                  Welcome back, {user.fullName}!
                </span>
              </h1>
              <p className="text-muted-foreground">Manage your events and registrations</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-[#a56aff]/20 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Registrations</CardTitle>
                    <Ticket className="h-4 w-4 text-[#a56aff]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{registrations.length}</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-[#a56aff]/20 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
                    <Calendar className="h-4 w-4 text-[#a56aff]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{upcomingEvents.length}</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-[#a56aff]/20 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Profile</CardTitle>
                    <UserIcon className="h-4 w-4 text-[#a56aff]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">{user.role === "admin" ? "Admin" : "Student"}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Admin Quick Action */}
            {user.role === "admin" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8"
              >
                <Card className="border-[#a56aff]/20 bg-gradient-to-r from-[#a56aff]/10 to-purple-500/10 backdrop-blur-sm">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Create New Event</h3>
                      <p className="text-sm text-muted-foreground">Add a new event to the platform</p>
                    </div>
                    <Button className="bg-[#a56aff] hover:bg-[#a56aff]/90" onClick={() => router.push("/events/new")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Registrations Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Tabs defaultValue="upcoming" className="space-y-6">
                <TabsList className="bg-black/50 border border-[#a56aff]/20">
                  <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#a56aff]">
                    Upcoming Events ({upcomingEvents.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" className="data-[state=active]:bg-[#a56aff]">
                    Past Events ({pastEvents.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <EventCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingEvents.map((reg, index) => (
                        <EventCard key={reg._id} event={reg.eventId} index={index} />
                      ))}
                    </div>
                  ) : (
                    <Card className="border-[#a56aff]/20 bg-black/50 backdrop-blur-sm">
                      <CardContent className="p-12 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                        <p className="text-muted-foreground mb-4">You haven't registered for any upcoming events yet</p>
                        <Button
                          variant="outline"
                          className="border-[#a56aff]/30 bg-transparent"
                          onClick={() => router.push("/events")}
                        >
                          Browse Events
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="past">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <EventCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : pastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pastEvents.map((reg, index) => (
                        <EventCard key={reg._id} event={reg.eventId} index={index} />
                      ))}
                    </div>
                  ) : (
                    <Card className="border-[#a56aff]/20 bg-black/50 backdrop-blur-sm">
                      <CardContent className="p-12 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No past events</h3>
                        <p className="text-muted-foreground">You haven't attended any events yet</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}