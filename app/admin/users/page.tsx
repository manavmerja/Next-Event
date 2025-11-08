"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MoreHorizontal, Trash2, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast({ title: "Error", description: "Failed to load users" })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role: newRole }),
      })
      if (!response.ok) throw new Error("Failed to update role")

      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)))
      toast({ title: "Success", description: `User role changed to ${newRole}` })
    } catch (error) {
      console.error("Failed to update role:", error)
      toast({ title: "Error", description: "Failed to update role" })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to delete user")

      setUsers(users.filter((u) => u._id !== userId))
      toast({ title: "Success", description: "User deleted successfully" })
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast({ title: "Error", description: "Failed to delete user" })
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Manage Users</h1>
        <p className="text-gray-400">View and manage user accounts and roles</p>
      </div>

      {/* Users table with fade-in animation */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-[#0a0a0a] border-[#a56aff]/20">
          <CardHeader>
            <CardTitle className="text-white">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-400">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#a56aff]/20 hover:bg-transparent">
                      <TableHead className="text-gray-400">Full Name</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Role</TableHead>
                      <TableHead className="text-gray-400">Student ID</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-[#a56aff]/20 hover:bg-[#a56aff]/5 transition-colors"
                      >
                        <TableCell className="font-medium text-white">{user.fullName}</TableCell>
                        <TableCell className="text-gray-300">{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === "Admin"
                                ? "bg-purple-900/30 text-purple-400"
                                : "bg-gray-900/30 text-gray-400"
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300">{user.studentId || "-"}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#a56aff]/20">
                              {user.role !== "Admin" && (
                                <DropdownMenuItem
                                  className="text-gray-300 focus:text-white focus:bg-[#a56aff]/20 cursor-pointer"
                                  onClick={() => handleChangeRole(user._id, "Admin")}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Change Role to Admin
                                </DropdownMenuItem>
                              )}
                              {user.role !== "Student" && (
                                <DropdownMenuItem
                                  className="text-gray-300 focus:text-white focus:bg-[#a56aff]/20 cursor-pointer"
                                  onClick={() => handleChangeRole(user._id, "Student")}
                                >
                                  <User className="h-4 w-4 mr-2" />
                                  Change Role to Student
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-400 focus:text-red-300 focus:bg-red-900/20 cursor-pointer"
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
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
