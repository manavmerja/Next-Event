"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Users, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { EventCardSkeleton } from "@/components/loading-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CustomCursor } from "@/components/custom-cursor"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { eventsAPI } from "@/lib/api"

const categories = ["All", "Hackathon", "Technical", "Cultural", "Sports", "Webinar", "Seminar"]

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = selectedCategory !== "All" ? { category: selectedCategory, limit: 6 } : { limit: 6 }
        const data = await eventsAPI.getAll(params)
        setEvents(data.events)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [selectedCategory])

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        {/* Hero Section */}
        <section
          className="relative py-20 md:py-32 overflow-hidden"
          style={{
            background: "linear-gradient(45deg, #061823 0%, #000000 27%, #1C1DFF 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <Badge className="bg-[#a56aff]/20 text-[#a56aff] border-[#a56aff]/30 text-sm px-4 py-1">
                <Sparkles className="h-3 w-3 inline mr-2" />
                Discover Amazing Events
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance">
                <span className="bg-gradient-to-r from-white via-purple-200 to-[#a56aff] bg-clip-text text-transparent">
                  Your Gateway to
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#a56aff] to-purple-400 bg-clip-text text-transparent">
                  Unforgettable Experiences
                </span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto text-pretty">
                Explore, register, and manage all your events in one place. From hackathons to cultural nights, find
                what excites you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="bg-[#a56aff] hover:bg-[#a56aff]/90 text-white" asChild>
                  <Link href="/events">
                    Browse Events
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#a56aff]/30 hover:bg-[#a56aff]/10 bg-transparent"
                  asChild
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
            >
              {[
                { icon: Calendar, label: "Active Events", value: "50+" },
                { icon: Users, label: "Registered Users", value: "1000+" },
                { icon: Sparkles, label: "Categories", value: "7" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-black/30 backdrop-blur-sm border border-[#a56aff]/20 rounded-lg p-6 text-center"
                >
                  <stat.icon className="h-8 w-8 text-[#a56aff] mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-foreground/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-black/50 border-b border-[#a56aff]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={
                    selectedCategory === category
                      ? "bg-[#a56aff] hover:bg-[#a56aff]/90"
                      : "border-[#a56aff]/30 hover:bg-[#a56aff]/10"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-16 bg-gradient-to-b from-black to-[#061823]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[#a56aff] to-purple-400 bg-clip-text text-transparent">
                  Featured Events
                </span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the most popular and upcoming events happening around you
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            ) : events.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event, index) => (
                    <EventCard key={event._id} event={event} index={index} />
                  ))}
                </div>
                <div className="text-center mt-12">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#a56aff]/30 hover:bg-[#a56aff]/10 bg-transparent"
                    asChild
                  >
                    <Link href="/events">
                      View All Events
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No events found in this category</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}
