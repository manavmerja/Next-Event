"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LayoutDashboard, Calendar, Users, ClipboardCheck, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { adminAPI, eventsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, users: 0, registrations: 0 })
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [eventsData, usersData, registrationsData] = await Promise.all([
          eventsAPI.getAll(),
          adminAPI.getAllUsers(),
          adminAPI.getAllRegistrations(),
        ])

        setStats({
          events: eventsData.pagination.total,
          users: usersData.users.length,
          registrations: registrationsData.registrations.length,
        })

        setRecentRegistrations(registrationsData.registrations)
      } catch (error) {
        console.error("Dashboard data error:", error)
        toast({ title: "Error", description: "Failed to load dashboard data", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  if (loading) return <div className="p-8 text-white">Loading dashboard...</div>

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Total Events", value: stats.events, icon: Calendar, color: "text-blue-400" },
          { title: "Total Users", value: stats.users, icon: Users, color: "text-green-400" },
          { title: "Total Registrations", value: stats.registrations, icon: ClipboardCheck, color: "text-purple-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-[#0a0a0a] border-[#a56aff]/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Registrations Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-[#0a0a0a] border-[#a56aff]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-[#a56aff]" />
              Recent Registrations (Who participating in which event)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRegistrations.length === 0 ? (
              <p className="text-gray-400">No registrations yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#a56aff]/20 hover:bg-transparent">
                      <TableHead className="text-gray-400">Student Name</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Event Name</TableHead>
                      <TableHead className="text-gray-400">Event Date</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRegistrations.map((reg) => (
                      <TableRow key={reg._id} className="border-[#a56aff]/20 hover:bg-[#a56aff]/5">
                        <TableCell className="font-medium text-white">
                          {reg.userId ? reg.userId.fullName : <span className="text-red-500">Deleted User</span>}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {reg.userId ? reg.userId.email : "-"}
                        </TableCell>
                        <TableCell className="text-white">
                          {reg.eventId ? reg.eventId.title : <span className="text-red-500">Deleted Event</span>}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {reg.eventId ? new Date(reg.eventId.startsAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-green-500 text-green-500">
                            {reg.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
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