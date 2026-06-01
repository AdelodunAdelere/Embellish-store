"use client";
import { useState } from "react";
import { Star, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name?: string;
}

const MOCK_REVIEWS: Review[] = [
  { id: "1", rating: 5, comment: "Absolutely stunning quality! I get compliments every time I carry this bag. Very happy with my purchase.", created_at: "2025-11-10", user_name: "Chioma A." },
  { id: "2", rating: 4, comment: "Beautiful piece. Arrived promptly and packaging was gorgeous. Slightly smaller than expected but still lovely.", created_at: "2025-10-28", user_name: "Funmilayo O." },
  { id: "3", rating: 5, comment: "Best accessory I've bought in a while! The craftsmanship is excellent and it looks even better in person.", created_at: "2025-10-14", user_name: "Adaeze N." },
];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={20}
            className={
              star <= (hover || value)
                ? "fill-taupe text-taupe"
                : "text-blush fill-blush"
            }
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-2xl border border-blush/20 p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-cream border border-blush/30 flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-taupe" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-plum">{review.user_name || "Customer"}</p>
            <time className="text-[11px] text-taupe">
              {new Date(review.created_at).toLocaleDateString("en-NG", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </time>
          </div>
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < review.rating ? "fill-taupe text-taupe" : "text-blush fill-blush"}
              />
            ))}
          </div>
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-brown leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}

export default function ReviewsSection({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviews] = useState<Review[]>(MOCK_REVIEWS);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a rating"); return; }

    setSubmitting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Sign in to leave a review");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    });

    setSubmitting(false);
    if (error) {
      toast.error(error.code === "23505" ? "You've already reviewed this product" : error.message);
    } else {
      toast.success("Thank you for your review!");
      setRating(0);
      setComment("");
    }
  };

  return (
    <section>
      <div className="flex items-baseline gap-4 mb-8">
        <h2 className="font-serif text-3xl text-plum">Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(avgRating) ? "fill-taupe text-taupe" : "text-blush fill-blush"}
                />
              ))}
            </div>
            <span className="text-sm text-taupe">{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Review list */}
        <div className="md:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-blush/20 p-10 text-center">
              <p className="font-serif text-lg text-plum mb-1">No reviews yet</p>
              <p className="text-sm text-taupe">Be the first to review {productName}</p>
            </div>
          ) : (
            reviews.map((r) => <ReviewCard key={r.id} review={r} />)
          )}
        </div>

        {/* Write a review */}
        <div>
          <div className="bg-white rounded-2xl border border-blush/20 p-6">
            <h3 className="font-serif text-lg text-plum mb-4">Write a review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-xs tracking-widest text-taupe uppercase mb-2">Your rating</p>
                <StarPicker value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="text-xs tracking-widest text-taupe uppercase block mb-1.5">
                  Comment (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share your experience…"
                  className="w-full border border-blush/30 rounded-xl px-4 py-3 text-sm text-plum placeholder:text-taupe/50 focus:outline-none focus:border-taupe bg-white resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-plum text-blush text-xs tracking-widest uppercase py-3 rounded-full hover:bg-mauve transition-colors disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
