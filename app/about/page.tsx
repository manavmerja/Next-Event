"use client"

import { motion } from "framer-motion"
import { Target, Users, Zap, Heart } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CustomCursor } from "@/components/custom-cursor"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To connect people with amazing events and create unforgettable experiences for everyone.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a vibrant community where event organizers and attendees can thrive together.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Leveraging cutting-edge technology to make event discovery and management seamless.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We're passionate about bringing people together through meaningful events and experiences.",
    },
  ]

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 bg-gradient-to-b from-black to-[#061823]">
          {/* Hero */}
          <section className="py-20 bg-gradient-to-br from-[#061823] via-black to-[#1C1DFF]/20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-[#a56aff] to-purple-400 bg-clip-text text-transparent">
                    About Next Event
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Next Event is your ultimate platform for discovering, managing, and attending events. We believe in
                  the power of bringing people together through shared experiences.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Values */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border-[#a56aff]/20 bg-black/50 backdrop-blur-sm h-full">
                      <CardContent className="p-6">
                        <value.icon className="h-10 w-10 text-[#a56aff] mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Story */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-center mb-8">
                  <span className="bg-gradient-to-r from-[#a56aff] to-purple-400 bg-clip-text text-transparent">
                    Our Story
                  </span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Next Event was born from a simple idea: make it easier for people to discover and attend events that
                    matter to them. We noticed that event information was scattered across multiple platforms, making it
                    difficult for both organizers and attendees to connect.
                  </p>
                  <p>
                    Today, we're proud to serve thousands of users, helping them discover everything from hackathons and
                    technical workshops to cultural celebrations and sports events. Our platform brings together event
                    organizers and attendees in one seamless experience.
                  </p>
                  <p>
                    We're constantly evolving, adding new features and improving the user experience based on feedback
                    from our amazing community. Join us in our mission to make event discovery and management effortless
                    for everyone.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        </div>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}
