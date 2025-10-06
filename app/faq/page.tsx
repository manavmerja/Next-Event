"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CustomCursor } from "@/components/custom-cursor"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I register for an event?",
      answer:
        "Simply browse our events page, click on an event you're interested in, and click the 'Register Now' button. You'll need to be logged in to register for events.",
    },
    {
      question: "Can I cancel my registration?",
      answer:
        "Yes, you can cancel your registration from your dashboard. Go to 'My Registrations' and click the cancel button next to the event you want to cancel.",
    },
    {
      question: "How do I create an event?",
      answer:
        "Event creation is currently limited to admin users. If you're an organizer and want to create events, please contact us to get admin access.",
    },
    {
      question: "Are the events free?",
      answer:
        "Most events on our platform are free for students. Some special events may have registration fees, which will be clearly mentioned in the event details.",
    },
    {
      question: "How do I get notifications about new events?",
      answer:
        "Once you're registered, you'll receive email notifications about new events in your preferred categories. You can manage your notification preferences in your dashboard.",
    },
    {
      question: "Can I bookmark events?",
      answer:
        "Yes! Click the bookmark icon on any event card or detail page to save it to your bookmarks. You can view all your bookmarked events in your dashboard.",
    },
    {
      question: "What if I can't find the event location?",
      answer:
        "Each event detail page includes an interactive map showing the exact location. You can also find the venue name and location text in the event details.",
    },
    {
      question: "How do I contact event organizers?",
      answer:
        "Event organizer contact information is displayed on each event detail page. You can reach out to them directly via the provided email address.",
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
                    Frequently Asked Questions
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground">Find answers to common questions about Next Event</p>
              </motion.div>
            </div>
          </section>

          {/* FAQs */}
          <section className="py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-[#a56aff]/20 bg-black/50 backdrop-blur-sm rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left hover:text-[#a56aff] transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
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
