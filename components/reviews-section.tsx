"use client" // Fixed: Added missing quote

import { useState, useEffect } from "react"
import { Star, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { eventsAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// This import is correct
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// DELETED: The duplicate import line was here

interface ReviewsSectionProps {
  eventId: string
}

export function ReviewsSection({ eventId }: ReviewsSectionProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form States
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // 1. Reviews Fetch Karo
  const fetchReviews = async () => {
    try {
      const data = await eventsAPI.getReviews(eventId)
      setReviews(data.reviews)
    } catch (error) {
      console.error("Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [eventId])

  // 2. Review Submit Karo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast({ title: "Rating required", description: "Please select at least 1 star", variant: "destructive" })
      return
    }
    setSubmitting(true)
    try {
      await eventsAPI.addReview(eventId, { rating, comment })
      toast({ title: "Review added!", description: "Thanks for your feedback." })
      setComment("")
      setRating(0)
      fetchReviews() // List refresh karo
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to add review", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  // 🌟 Helper: Stars kaise dikhenge?
  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-5 h-5 transition-all duration-200",
              interactive ? "cursor-pointer hover:scale-110" : "",
              // GLOW LOGIC: Agar star selected hai toh Cyan + Glow, nahi toh Gray outline
              star <= count 
                ? "fill-[#00F0FF] text-[#00F0FF] drop-shadow-[0_0_8px_#00F0FF]" 
                : "text-gray-600 fill-transparent"
            )}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-12 space-y-8">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        Event Reviews <span className="text-[#00F0FF] text-lg">({reviews.length})</span>
      </h2>

      {/* Review Form (Sirf logged-in users ke liye) */}
      {user ? (
        <Card className="bg-black/40 border-[#00F0FF]/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-200">Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Your Rating</label>
                {renderStars(rating, true)}
              </div>
              <Textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-black/50 border-[#00F0FF]/30 focus:border-[#00F0FF] min-h-[100px]"
              />
              <Button type="submit" disabled={submitting} className="bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black font-bold">
                {submitting ? "Submitting..." : "Post Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="p-4 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-center text-gray-400">
          Please login to write a review.
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00F0FF]/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-[#00F0FF]/50">
                    <AvatarFallback className="bg-black text-[#00F0FF]">
                      {review.userId?.fullName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-white">{review.userId?.fullName || "Anonymous"}</p>
                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-300 text-sm mt-2 pl-11">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}