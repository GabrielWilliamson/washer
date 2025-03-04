import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StarRatingProps {
  washerId: number | string
  initialRating: number
}

export default function StarRating({ washerId, initialRating }: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setRating(initialRating)
    setHasRated(false)
  }, [initialRating])

  const handleRating = async (newRating: number) => {
    if (hasRated || isSubmitting) return

    setIsSubmitting(true)

    try {
      // Call API to save the rating
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          washerId,
          rating: newRating,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit rating")
      }

      // Update local state with the new rating
      setRating(newRating)
      setHasRated(true)
    } catch (error) {
      console.error("Error submitting rating:", error)
      // You could show an error message here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-all duration-150 ${
              (hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => !hasRated && setHoverRating(star)}
            onMouseLeave={() => !hasRated && setHoverRating(0)}
            onClick={(e) => {
              e.preventDefault() // Prevent navigation when clicking on stars
              if (!hasRated) handleRating(star)
            }}
          />
        ))}
      </div>

      {hasRated ? (
        <div className="w-full text-center text-sm font-medium text-green-600">Thanks for rating this washer!</div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs h-8 mt-1"
          onClick={(e) => {
            e.preventDefault() // Prevent navigation
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Click stars to rate"}
        </Button>
      )}
    </div>
  )
}

