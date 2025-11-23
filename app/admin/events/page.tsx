"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Download, Plus, MoreHorizontal, FilePenLine, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { eventsAPI, adminAPI } from "@/lib/api" // <-- IMPORT adminAPI
import { useToast } from "@/hooks/use-toast"

export default function ManageEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const data = await eventsAPI.getAll({ limit: 1000 })
      setEvents(data.events)
    } catch (error) {
      console.error("Failed to fetch events:", error)
      toast({ title: "Error", description: "Failed to load events", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      await eventsAPI.delete(eventId)
      setEvents(events.filter((e) => e._id !== eventId))
      toast({ title: "Success", description: "Event deleted successfully" })
    } catch (error) {
      console.error("Failed to delete event:", error)
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" })
    }
  }

  // --- UPDATED EXPORT FUNCTION ---
  const handleExport = async () => {
    try {
      toast({ title: "Downloading...", description: "Generating CSV file" })
      await adminAPI.downloadCSV()
      toast({ title: "Success", description: "Download started" })
    } catch (error) {
      console.error("Export failed:", error)
      toast({ title: "Error", description: "Failed to download CSV", variant: "destructive" })
    }
  }
  // -------------------------------

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Manage Events</h1>
          <p className="text-gray-400">View and manage all events in the system</p>
        </div>
        <div className="flex gap-3">
          {/* --- UPDATED BUTTON --- */}
          <Button
            variant="outline"
            className="border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Registrations to CSV
          </Button>
          {/* ------------------------ */}
          
          <Button className="bg-[#a56aff] hover:bg-[#a56aff]/90 text-white" asChild>
            <Link href="/events/new">
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Events table with fade-in animation */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-[#0a0a0a] border-[#a56aff]/20">
          <CardHeader>
            <CardTitle className="text-white">All Events</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : events.length === 0 ? (
              <p className="text-gray-400">No events found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#a56aff]/20 hover:bg-transparent">
                      <TableHead className="text-gray-400">Event Title</TableHead>
                      <TableHead className="text-gray-400">Category</TableHead>
                      <TableHead className="text-gray-400">Starts At</TableHead>
                      <TableHead className="text-gray-400">Venue</TableHead>
                      <TableHead className="text-gray-400">Registrants</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event, index) => (
                      <motion.tr
                        key={event._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-[#a56aff]/20 hover:bg-[#a56aff]/5 transition-colors"
                      >
                        <TableCell className="font-medium text-white">{event.title}</TableCell>
                        <TableCell className="text-gray-300">{event.category}</TableCell>
                        <TableCell className="text-gray-300">{new Date(event.startsAt).toLocaleString()}</TableCell>
                        <TableCell className="text-gray-300">{event.venue}</TableCell>
                        <TableCell className="text-gray-300">{event.registrations?.length || 0}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#a56aff]/20">
                              <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-[#a56aff]/20 cursor-pointer">
                                <FilePenLine className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-400 focus:text-red-300 focus:bg-red-900/20 cursor-pointer"
                                onClick={() => handleDelete(event._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}