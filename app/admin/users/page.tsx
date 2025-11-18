"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MoreHorizontal, Trash2, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { adminAPI } from "@/lib/api" // 1. IMPORT OUR API
import { useAuth } from "@/lib/auth-context" // Import useAuth to get current admin's ID

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user: adminUser } = useAuth() // Get the currently logged-in admin

  useEffect(() => {
    fetchUsers()
  }, [])

  // 2. USE OUR 'adminAPI'
  const fetchUsers = async () => {
    try {
      // This now uses our 'apiRequest' which sends the auth cookie
      const data = await adminAPI.getAllUsers()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast({ title: "Error", description: "Failed to load users", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // 3. USE OUR 'adminAPI'
  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await adminAPI.updateUserRole(userId, newRole)
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)))
      toast({ title: "Success", description: `User role changed to ${newRole}` })
    } catch (error) {
      console.error("Failed to update role:", error)
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" })
    }
  }

  // 4. USE OUR 'adminAPI'
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await adminAPI.deleteUser(userId)
      setUsers(users.filter((u) => u._id !== userId))
      toast({ title: "Success", description: "User deleted successfully" })
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" })
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
                              // 5. FIX THE LOGIC (use lowercase)
                              user.role === "admin"
                                ? "bg-purple-900/30 text-purple-400"
                                : "bg-gray-900/30 text-gray-400"
                            }`}
                          >
                            {/* 6. FIX THE CAPITALIZATION */}
                            {user.role === 'admin' ? 'Admin' : 'Student'}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300">{user.studentId || "-"}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={user._id === adminUser?.id}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#a56aff]/20">
                              {/* 7. FIX THE LOGIC (use lowercase) */}
                              {user.role !== "admin" && (
                                <DropdownMenuItem
                                  className="text-gray-300 focus:text-white focus:bg-[#a56aff]/20 cursor-pointer"
                                  onClick={() => handleChangeRole(user._id, "admin")}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Change Role to Admin
                                </DropdownMenuItem>
                              )}
                              {user.role !== "student" && (
                                <DropdownMenuItem
                                  className="text-gray-300 focus:text-white focus:bg-[#a56aff]/20 cursor-pointer"
                                  onClick={() => handleChangeRole(user._id, "student")}
                                >
                                  <User className="h-4 w-4 mr-2" />
                                  Change Role to Student
                                </DropdownMenuItem>
                              )}
                              {/* Add check to prevent admin from deleting themself */}
                              {user._id !== adminUser?.id && (
                                <DropdownMenuItem
                                  className="text-red-400 focus:text-red-300 focus:bg-red-900/20 cursor-pointer"
                                  onClick={() => handleDeleteUser(user._id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              )}
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