"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LogOut, 
  User as UserIcon, 
  Ticket, 
  Heart, 
  Calendar, 
  MapPin, 
  ExternalLink,
  QrCode
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react" // 👈 QR Code Library

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { registrationsAPI, authAPI } from "@/lib/api"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch My Registrations (Internal Events)
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      try {
        const data = await registrationsAPI.getMyRegistrations()
        setRegistrations(data.registrations)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [authLoading, user, router])

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      logout()
      toast({ title: "Logged out", description: "See you soon!" })
      router.push("/")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a56aff]"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-[#a56aff] shadow-[0_0_20px_rgba(165,106,255,0.3)]">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
              <AvatarFallback className="bg-[#a56aff] text-white text-xl">
                {user.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.fullName}</h1>
              <p className="text-gray-400">{user.email}</p>
              <div className="flex gap-2 mt-2">
                 <Badge variant="outline" className="border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/10">
                    {user.role === 'admin' ? 'Admin Access' : 'Student Account'}
                 </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-red-500/50 text-red-400 hover:bg-red-950/30 hover:text-red-300">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="tickets" className="w-full space-y-8">
          <TabsList className="bg-black/40 border border-white/10 p-1 rounded-xl w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="tickets" className="data-[state=active]:bg-[#a56aff] data-[state=active]:text-white rounded-lg transition-all">
              <Ticket className="mr-2 h-4 w-4" /> My Tickets
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-[#00F0FF] data-[state=active]:text-black font-medium rounded-lg transition-all">
              <Heart className="mr-2 h-4 w-4" /> Saved Events
            </TabsTrigger>
          </TabsList>

          {/* 🎫 TAB 1: MY TICKETS (Internal Registrations) */}
          <TabsContent value="tickets">
             <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }}
               className="grid grid-cols-1 md:grid-cols-2 gap-6"
             >
               {registrations.length === 0 ? (
                 <div className="col-span-full text-center py-12 text-gray-500">
                   <Ticket className="h-12 w-12 mx-auto mb-4 opacity-20" />
                   <p>You haven't registered for any internal events yet.</p>
                   <Button variant="link" asChild className="text-[#a56aff] mt-2">
                     <Link href="/explore">Explore Events</Link>
                   </Button>
                 </div>
               ) : (
                 registrations.map((reg) => (
                   <Card key={reg._id} className="bg-[#121212] border-[#a56aff]/30 overflow-hidden flex flex-col md:flex-row shadow-lg hover:shadow-[0_0_20px_rgba(165,106,255,0.15)] transition-all">
                      {/* Left: Event Info */}
                      <div className="p-6 flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{reg.eventId?.title}</h3>
                            <p className="text-sm text-gray-400 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" /> 
                              {new Date(reg.eventId?.startsAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-400 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" /> 
                              {reg.eventId?.venue}
                            </p>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Confirmed</Badge>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ticket ID</p>
                          <p className="font-mono text-[#a56aff]">{reg._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>

                      {/* Right: QR Code (Ticket) */}
                      <div className="bg-white p-6 flex items-center justify-center flex-col gap-2 min-w-[150px]">
                        <QRCodeSVG value={`TICKET:${reg._id}`} size={100} />
                        <span className="text-black text-[10px] font-bold uppercase tracking-widest">Scan Me</span>
                      </div>
                   </Card>
                 ))
               )}
             </motion.div>
          </TabsContent>

          {/* ❤️ TAB 2: SAVED EVENTS (Bookmarks) */}
          <TabsContent value="saved">
            <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
             >
              {(!user.bookmarks || user.bookmarks.length === 0) ? (
                 <div className="col-span-full text-center py-12 text-gray-500">
                   <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                   <p>No saved events. Go explore and find something cool!</p>
                   <Button variant="link" asChild className="text-[#00F0FF] mt-2">
                     <Link href="/explore">Explore Events</Link>
                   </Button>
                 </div>
              ) : (
                // Note: Typescript might complain if populate isn't typed perfectly, but data will flow
                (user.bookmarks as any[]).map((event: any) => (
                  <Card key={event._id} className="bg-[#121212] border-white/10 overflow-hidden hover:border-[#00F0FF]/50 transition-all group">
                    <div className="relative h-40 w-full">
                       <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                       <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white border border-white/10">
                            {event.category}
                          </Badge>
                       </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg text-white truncate">{event.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(event.startsAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button className="w-full bg-[#00F0FF] text-black hover:bg-[#00F0FF]/80 font-semibold" asChild>
                        <Link href={`/events/${event._id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}