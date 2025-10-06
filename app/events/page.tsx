"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { EventCardSkeleton } from "@/components/loading-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CustomCursor } from "@/components/custom-cursor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { eventsAPI } from "@/lib/api"

const categories = ["All", "Hackathon", "Technical", "Cultural", "Sports", "Webinar", "Seminar", "Other"]

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const params: any = { page, limit: 12 }
        if (selectedCategory !== "All") params.category = selectedCategory
        if (searchQuery) params.search = searchQuery

        const data = await eventsAPI.getAll(params)
        setEvents(data.events)
        setTotalPages(data.pagination.pages)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [selectedCategory, searchQuery, page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        {/* Header */}
        <section className="py-12 bg-gradient-to-br from-[#061823] via-black to-[#1C1DFF]/20 border-b border-[#a56aff]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-[#a56aff] to-purple-400 bg-clip-text text-transparent">
                  Explore Events
                </span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find the perfect event for you from our extensive collection
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="py-8 bg-black/50 border-b border-[#a56aff]/20 sticky top-16 z-40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/30 border-[#a56aff]/30 focus:border-[#a56aff]"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <Filter className="h-5 w-5 text-[#a56aff] flex-shrink-0" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={
                      selectedCategory === category
                        ? "bg-[#a56aff] hover:bg-[#a56aff]/90 whitespace-nowrap"
                        : "border-[#a56aff]/30 hover:bg-[#a56aff]/10 whitespace-nowrap"
                    }
                    onClick={() => {
                      setSelectedCategory(category)
                      setPage(1)
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="flex-1 py-12 bg-gradient-to-b from-black to-[#061823]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      className="border-[#a56aff]/30 bg-transparent"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      className="border-[#a56aff]/30 bg-transparent"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No events found matching your criteria</p>
                <Button
                  variant="outline"
                  className="mt-4 border-[#a56aff]/30 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                    setPage(1)
                  }}
                >
                  Clear Filters
                </Button>
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
