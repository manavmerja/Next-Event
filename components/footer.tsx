"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Instagram, Linkedin, Star, GitFork } from "lucide-react"

export function Footer() {
  // State for GitHub Stats
  const [stars, setStars] = useState<number | null>(null)
  const [forks, setForks] = useState<number | null>(null)

  // Fetch GitHub Stats on mount
  useEffect(() => {
    // Replace 'manavmerja/Next-Event' with your actual repo if different
    fetch("https://api.github.com/repos/manavmerja/Next-Event")
      .then((res) => res.json())
      .then((data) => {
        setStars(data.stargazers_count)
        setForks(data.forks_count)
      })
      .catch((err) => console.error("Failed to fetch GitHub stats", err))
  }, [])

  return (
    <footer className="bg-black border-t border-[#00F0FF]/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* 1. Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* Logo Image */}
              <Image 
                src="/image.jpg" 
                alt="Next Event Logo" 
                width={150} 
                height={40} 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Your ultimate event aggregator platform. Discover, register, and manage events all in one place.
            </p>
            
            {/* 4. GitHub Live Stats Widget */}
            <Link 
              href="https://github.com/manavmerja/Next-Event" 
              target="_blank"
              className="inline-flex items-center gap-4 p-3 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 hover:bg-[#00F0FF]/20 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5 text-[#00F0FF]" />
                <span className="font-semibold text-[#00F0FF]">Star us on GitHub</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{stars !== null ? stars : "-"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  <span>{forks !== null ? forks : "-"}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-[#00F0FF]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-sm text-muted-foreground hover:text-[#00F0FF] transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-[#00F0FF] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-[#00F0FF] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-[#00F0FF] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-[#00F0FF]">Categories</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Hackathons</li>
              <li className="text-sm text-muted-foreground">Technical</li>
              <li className="text-sm text-muted-foreground">Cultural</li>
              <li className="text-sm text-muted-foreground">Sports</li>
              <li className="text-sm text-muted-foreground">Webinars</li>
            </ul>
          </div>

          {/* 2. Social Media Links (Replacing Contact) */}
          <div>
            <h3 className="font-semibold mb-4 text-[#00F0FF]">Connect With Us</h3>
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-muted-foreground">
                Follow us on social media for updates and announcements.
              </p>
              <div className="flex space-x-4">
                <Link href="https://github.com/manavmerja" target="_blank" className="text-gray-400 hover:text-[#00F0FF] transition-colors">
                  <Github className="h-6 w-6" />
                </Link>
                <Link href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-[#00F0FF] transition-colors">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="https://linkedin.com" target="_blank" className="text-gray-400 hover:text-[#00F0FF] transition-colors">
                  <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="https://instagram.com" target="_blank" className="text-gray-400 hover:text-[#00F0FF] transition-colors">
                  <Instagram className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#00F0FF]/20 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Next Event. Part of the GitHub Developer Program.</p>
        </div>
      </div>
    </footer>
  )
}