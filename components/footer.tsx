import Link from "next/link"
import { Calendar, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black border-t border-[#a56aff]/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-[#a56aff]" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#a56aff] to-purple-400 bg-clip-text text-transparent">
                Next Event
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your ultimate event aggregator platform. Discover, register, and manage events all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-[#a56aff]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-sm text-muted-foreground hover:text-[#a56aff] transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-[#a56aff] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-[#a56aff] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-[#a56aff] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-[#a56aff]">Categories</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Hackathons</li>
              <li className="text-sm text-muted-foreground">Technical</li>
              <li className="text-sm text-muted-foreground">Cultural</li>
              <li className="text-sm text-muted-foreground">Sports</li>
              <li className="text-sm text-muted-foreground">Webinars</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-[#a56aff]">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@nextevent.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Campus Center, Main Building</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#a56aff]/20 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Next Event. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
