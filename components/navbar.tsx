"use client"

import { useState, useEffect } from "react" // 1. IMPORT 'useEffect'
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  // 2. REMOVED 'loading' - we don't need it for this
  const { user, logout } = useAuth() 

  // 3. ADDED 'isClient' STATE
  const [isClient, setIsClient] = useState(false)

  // 4. ADDED 'useEffect' TO SET 'isClient'
  useEffect(() => {
    // This code only runs in the browser, AFTER the page loads
    setIsClient(true)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ]

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#a56aff]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/image.jpg"
              alt="Next Event Logo"
              width={200}
              height={50}
              className="h-12 w-auto" // Set to h-12 as we discussed before
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#a56aff] ${
                  pathname === link.href ? "text-[#a56aff]" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 5. UPDATED USER MENU / AUTH BUTTONS */}
          <div className="hidden md:flex items-center space-x-4 h-9">
            {!isClient ? (
              // On the server OR before client loads, show a blank placeholder
              // This placeholder is 'h-9 w-24', so we match it.
              <div className="h-9 w-24 rounded-md" />
            ) : user ? (
              // AFTER client loads, AND user is logged in
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
  {/* Agar admin hai toh /admin/dashboard, warna /dashboard */}
  <Link 
    href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} 
    className="cursor-pointer"
  >
    {user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
  </Link>
</DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/events/new" className="cursor-pointer">
                        Create Event
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // AFTER client loads, AND user is NOT logged in
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button className="bg-[#a56aff] hover:bg-[#a56aff]/90" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* 6. UPDATED MOBILE MENU LOGIC */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-[#a56aff]/20"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-medium ${
                  pathname === link.href ? "text-[#a56aff]" : "text-foreground/80"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* This logic MUST match the desktop logic to prevent hydration errors */}
            {!isClient ? (
              // Show a blank placeholder on server
              <div className="flex flex-col space-y-2 pt-2 h-[84px]" />
            ) : user ? (
              // Show mobile user links on client
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 text-sm font-medium text-foreground/80"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/events/new"
                    className="block py-2 text-sm font-medium text-foreground/80"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Event
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block py-2 text-sm font-medium text-destructive w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              // Show mobile auth buttons on client
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button className="w-full bg-[#a56aff] hover:bg-[#a56aff]/90" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}