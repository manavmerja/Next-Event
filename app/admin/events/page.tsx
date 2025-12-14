"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Download, Plus, MoreHorizontal, FilePenLine, Trash2, RefreshCw, Globe } from "lucide-react" // 👈 Added Icons
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { eventsAPI, adminAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge" // 👈 Added Badge for Source

export default function ManageEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false) // 👈 State for Sync Loader
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

  // --- 🔄 SYNC FUNCTION ---
  const handleSync = async () => {
    setSyncing(true)
    try {
      toast({ title: "Syncing...", description: "Fetching events from Ticketmaster..." })
      
      const res = await adminAPI.syncTicketmaster()
      
      toast({ title: "Success!", description: res.message })
      fetchEvents() // List refresh karo taaki naye events turant dikhein
    } catch (error: any) {
      console.error("Sync failed:", error)
      toast({ title: "Sync Failed", description: error.message || "Could not fetch external events", variant: "destructive" })
    } finally {
      setSyncing(false)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    try {
      await eventsAPI.delete(eventId)
      setEvents(events.filter((e) => e._id !== eventId))
      toast({ title: "Success", description: "Event deleted successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" })
    }
  }

  const handleExport = async () => {
    try {
      toast({ title: "Downloading...", description: "Generating CSV file" })
      await adminAPI.downloadCSV()
      toast({ title: "Success", description: "Download started" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to download CSV", variant: "destructive" })
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Manage Events</h1>
          <p className="text-gray-400">View and manage all events in the system</p>
        </div>
        <div className="flex flex-wrap gap-3">
          
          {/* 👇 SYNC BUTTON ADDED HERE 👇 */}
          <Button
            variant="outline"
            className="border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Ticketmaster"}
          </Button>
          {/* 👆 ----------------------- 👆 */}

          <Button
            variant="outline"
            className="border-[#a56aff]/30 text-gray-300 hover:bg-[#a56aff]/10"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button className="bg-[#a56aff] hover:bg-[#a56aff]/90 text-white" asChild>
            <Link href="/events/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-[#0a0a0a] border-[#a56aff]/20">
          <CardHeader>
            <CardTitle className="text-white">All Events ({events.length})</CardTitle>
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
                      <TableHead className="text-gray-400">Source</TableHead>
                      <TableHead className="text-gray-400">Category</TableHead>
                      <TableHead className="text-gray-400">Starts At</TableHead>
                      <TableHead className="text-gray-400">Venue</TableHead>
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
                        <TableCell className="font-medium text-white max-w-[200px] truncate" title={event.title}>
                          {event.title}
                        </TableCell>
                        
                        {/* 👇 Source Badge Display 👇 */}
                        <TableCell>
                          {event.isExternal ? (
                            <Badge variant="outline" className="border-blue-500 text-blue-400 bg-blue-900/20 text-xs">
                              <Globe className="w-3 h-3 mr-1" /> Ticketmaster
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-purple-500 text-purple-400 bg-purple-900/20 text-xs">
                              Internal
                            </Badge>
                          )}
                        </TableCell>
                        

                        <TableCell className="text-gray-300">{event.category}</TableCell>
                        <TableCell className="text-gray-300">{new Date(event.startsAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-gray-300 max-w-[150px] truncate" title={event.venue}>
                          {event.venue}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#a56aff]/20">
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