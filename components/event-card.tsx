"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, MapPin, ArrowRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { eventsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface EventCardProps {
  event: any
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const { user, refreshUser } = useAuth() // refreshUser might be needed to update local bookmarks
  const { toast } = useToast()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if the event is already bookmarked by the user
  useEffect(() => {
    if (user && user.bookmarks && user.bookmarks.includes(event._id)) {
      setIsBookmarked(true)
    } else {
      setIsBookmarked(false)
    }
  }, [user, event._id])

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent clicking the link to details page
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to bookmark events",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Optimistic UI update (turant rang badal do)
      const newState = !isBookmarked
      setIsBookmarked(newState)

      await eventsAPI.toggleBookmark(event._id)
      
      // Backend se confirm hone ke baad user data refresh karo
      // (This ensures local storage/context stays in sync)
      // Note: Agar aapke auth context mein refreshUser nahi hai, toh page reload par update hoga.
      
      toast({
        title: newState ? "Bookmarked!" : "Removed",
        description: newState ? "Event added to your wishlist" : "Event removed from wishlist",
      })
    } catch (error) {
      // Error aayi toh wapas purana state kar do
      setIsBookmarked(!isBookmarked)
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/events/${event._id}`}>
        <Card className="h-full overflow-hidden bg-black/40 border-[#a56aff]/20 backdrop-blur-sm hover:border-[#a56aff]/50 transition-colors group relative">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={event.bannerUrl || "/placeholder.svg?height=400&width=600"}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8 backdrop-blur-md"
                onClick={handleBookmark}
                disabled={loading}
              >
                <Heart 
                  className={cn("h-4 w-4 transition-colors", isBookmarked ? "fill-[#a56aff] text-[#a56aff]" : "text-white")} 
                />
              </Button>
            </div>
            <div className="absolute top-4 left-4">
              <Badge className="bg-[#a56aff] hover:bg-[#a56aff]/80">{event.category}</Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 pt-12">
              <div className="flex items-center text-xs text-gray-300 mb-1">
                <Calendar className="h-3 w-3 mr-1 text-[#a56aff]" />
                {new Date(event.startsAt).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-[#a56aff] transition-colors">
              {event.title}
            </h3>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">{event.description}</p>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {event.locationText}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <span className="text-xs text-[#a56aff] font-medium">View Details</span>
            <ArrowRight className="h-4 w-4 text-[#a56aff] transform group-hover:translate-x-1 transition-transform" />
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}