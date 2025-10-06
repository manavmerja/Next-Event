"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EventCardProps {
  event: {
    _id: string
    title: string
    description: string
    category: string
    startsAt: string
    venue: string
    locationText: string
    bannerUrl: string
  }
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const eventDate = new Date(event.startsAt)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const categoryColors: Record<string, string> = {
    Hackathon: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Technical: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Cultural: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    Sports: "bg-green-500/20 text-green-300 border-green-500/30",
    Webinar: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Seminar: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    Other: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Link href={`/events/${event._id}`}>
        <Card className="overflow-hidden border-[#a56aff]/20 bg-black/50 backdrop-blur-sm hover:border-[#a56aff]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#a56aff]/20 h-full">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={event.bannerUrl || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute top-3 right-3">
              <Badge className={categoryColors[event.category] || categoryColors.Other}>{event.category}</Badge>
            </div>
          </div>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-lg line-clamp-2 text-balance">{event.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-[#a56aff]" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-[#a56aff]" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-[#a56aff]" />
                <span className="line-clamp-1">{event.locationText}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <span className="text-sm text-[#a56aff] hover:underline">View Details →</span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
