"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, ClipboardCheck, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { eventsAPI } from "@/lib/api"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all events and users for stats
        const eventsData = await eventsAPI.getAll({ limit: 1000 })

        // Calculate stats
        const totalRegistrations = eventsData.events.reduce(
          (sum: number, event: any) => sum + (event.registrations?.length || 0),
          0,
        )

        setStats({
          totalEvents: eventsData.events.length,
          totalUsers: 1200, // Mock data
          totalRegistrations: totalRegistrations,
        })

        // Mock recent activity
        const activity = eventsData.events.slice(0, 5).map((event: any) => ({
          id: event._id,
          user: `User ${Math.floor(Math.random() * 1000)}`,
          activity: `Registered for ${event.title}`,
          date: new Date(event.createdAt).toLocaleDateString(),
        }))
        setRecentActivity(activity)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      title: "Total Registrations",
      value: stats.totalRegistrations,
      icon: ClipboardCheck,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
  ]

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's an overview of your events and users.</p>
      </div>

      {/* Stats grid with fade-in animation */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Card className="bg-[#0a0a0a] border-[#a56aff]/20 hover:border-[#a56aff]/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{loading ? "-" : stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">Total this month</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-[#0a0a0a] border-[#a56aff]/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription>Latest registrations and user activities</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-[#a56aff]" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#a56aff]/20 hover:bg-transparent">
                    <TableHead className="text-gray-400">User</TableHead>
                    <TableHead className="text-gray-400">Activity</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-[#a56aff]/20 hover:bg-[#a56aff]/5 transition-colors"
                    >
                      <TableCell className="text-gray-300">{activity.user}</TableCell>
                      <TableCell className="text-gray-300">{activity.activity}</TableCell>
                      <TableCell className="text-gray-400 text-sm">{activity.date}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
