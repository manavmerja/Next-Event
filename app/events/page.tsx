"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { EventCardSkeleton } from "@/components/loading-skeleton"
import { CustomCursor } from "@/components/custom-cursor"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { eventsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const categories = ["All", "Hackathon", "Technical", "Cultural", "Sports", "Webinar", "Seminar", "Other"]

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // --- NEW STATE FOR FILTERS ---
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  // -----------------------------
  const { toast } = useToast()

  const fetchEvents = async () => {
    setLoading(true)
    try {
      // Prepare filters
      const params: any = {}
      if (searchQuery) params.search = searchQuery
      if (selectedCategory && selectedCategory !== "All") params.category = selectedCategory

      // Call API with filters
      const data = await eventsAPI.getAll(params)
      setEvents(data.events)
    } catch (error) {
      console.error("Failed to fetch events:", error)
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchEvents()
  }, []) // Run once on mount

  // Handle Search Submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchEvents()
  }

  // Handle Clear Filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    // We need to trigger a fetch with cleared values manually here
    // or wait for the state to update and use a useEffect. 
    // Simple way: call API directly with empty params
    setLoading(true)
    eventsAPI.getAll().then(data => {
      setEvents(data.events)
      setLoading(false)
    })
  }

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 bg-gradient-to-b from-black to-[#061823] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Explore <span className="text-[#a56aff]">Events</span>
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Discover hackathons, workshops, cultural fests, and more happening around you.
              </p>
            </motion.div>

            {/* --- SEARCH & FILTER SECTION --- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-black/40 border border-[#a56aff]/20 p-4 rounded-xl backdrop-blur-sm mb-10"
            >
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    className="pl-10 bg-black/50 border-[#a56aff]/30 focus:border-[#a56aff]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Category Dropdown */}
                <div className="w-full md:w-48">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-black/50 border-[#a56aff]/30 focus:border-[#a56aff]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Category" />
                      </div>
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

                {/* Search Button */}
                <Button type="submit" className="bg-[#a56aff] hover:bg-[#a56aff]/90">
                  Search
                </Button>

                {/* Clear Filters (Only show if filters are active) */}
                {(searchQuery || selectedCategory !== "All") && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4 mr-2" /> Clear
                  </Button>
                )}
              </form>
            </motion.div>
            {/* ------------------------------- */}

            {/* Events Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            ) : events.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {events.map((event, index) => (
                  <EventCard key={event._id} event={event} index={index} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#a56aff]/10 mb-4">
                  <Search className="h-8 w-8 text-[#a56aff]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                <p className="text-gray-400">
                  We couldn't find any events matching your search. Try adjusting your filters.
                </p>
                <Button 
                  variant="link" 
                  className="text-[#a56aff] mt-2"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}