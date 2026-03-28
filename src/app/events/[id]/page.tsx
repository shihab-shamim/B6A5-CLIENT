"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Tag,
  Share2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Star,
  MessageSquare
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function EventDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.id as string;
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [userParticipantStatus, setUserParticipantStatus] = useState<string | null>(null);
  
  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Check for success/canceled query params from Stripe
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await api.post("/payments/verify", { eventId });
        toast.success("Payment successful! You are now registered.");
        setUserParticipantStatus(data.status); // Updates standard UI
      } catch (error) {
        console.error("Payment verification failed", error);
        toast.error("Payment verified failed, but Stripe may have succeeded. Check dashboard.");
      } finally {
        router.replace(`/events/${eventId}`);
      }
    };

    if (searchParams.get("success")) {
      verifyPayment();
    } else if (searchParams.get("canceled")) {
      toast.error("Payment was canceled.");
      router.replace(`/events/${eventId}`);
    }
  }, [searchParams, eventId, router]);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId, user]);

  const fetchEventDetails = async () => {
    try {
      const { data } = await api.get(`/events/${eventId}`);
      setEvent(data);
      
      if (user) {
        setIsOwner(data.organizerId === user.id);

        // Fetch participants to check current user's status
        // Ideally there's a specific endpoint for "my status", but for now if owner we fetch all,
        // if not owner we can try joining and see error, or just try to get participants if API allows.
        // Actually, let's add a quick endpoint or handled logic.
        // For now, let's fetch participants if owner:
        if (data.organizerId === user.id || user.role === "ADMIN") {
          const res = await api.get(`/events/${eventId}/participants`);
          setParticipants(res.data);
          
          // Check if owner is also a participant (unlikely, but possible)
          const myParticipant = res.data.find((p: any) => p.userId === user.id);
          if (myParticipant) setUserParticipantStatus(myParticipant.status);
        } else {
          try {
             const statusRes = await api.get(`/events/${eventId}/my-status`);
             if (statusRes.data && statusRes.data.status) {
               setUserParticipantStatus(statusRes.data.status);
             }
          } catch(e) {
             console.error("Failed to fetch participant status", e);
          }
        }
      }
      
      // Fetch Reviews
      try {
        const reviewsRes = await api.get(`/events/${eventId}/reviews`);
        setReviews(reviewsRes.data);
      } catch (reviewErr) {
        console.error("Failed to load reviews", reviewErr);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProcess = async () => {
    if (!user) {
      toast("Please login to join this event", { icon: "🔒" });
      router.push("/login");
      return;
    }

    setActionLoading(true);

    try {
      if (event.isFree) {
        // Free Event Logic
        const { data } = await api.post(`/events/${eventId}/join`);
        toast.success(data.message);
        setUserParticipantStatus(event.isPublic ? "APPROVED" : "PENDING");
      } else {
        // Paid Event Logic - Redirect directly to Stripe Checkout
        const { data } = await api.post("/payments/create-session", { eventId });
        
        if (data && data.url) {
          window.location.href = data.url;
        } else {
          toast.error("Failed to generate checkout link");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong processing your request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    
    setIsSubmittingReview(true);
    try {
      const { data } = await api.post(`/events/${eventId}/reviews`, {
        rating: newReviewRating,
        comment: newReviewComment
      });
      toast.success("Review submitted!");
      setNewReviewRating(5);
      setNewReviewComment("");
      
      // Add the new review to the list immediately with current user data
      setReviews([
        { 
          ...data, 
          user: { id: user?.id, name: user?.name, avatar: user?.avatar } 
        }, 
        ...reviews
      ]);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Event Not Found</h1>
        <p className="text-slate-400">The event you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  // Determine button state based on conditions
  let buttonText = "Join Event";
  let buttonAction: () => void | Promise<void> = handleJoinProcess;
  let isButtonDisabled = actionLoading;

  if (isOwner) {
    buttonText = "Manage Event";
    buttonAction = () => router.push(`/dashboard/events/${eventId}/participants`);
  } else if (!event.isFree) {
    buttonText = `Pay $${event.fee} & ${event.isPublic ? 'Join' : 'Request'}`;
  } else if (!event.isPublic) {
    buttonText = "Request to Join";
  }

  // Check if we know status
  if (userParticipantStatus === "APPROVED") {
     buttonText = "You're Going!";
     isButtonDisabled = true;
  } else if (userParticipantStatus === "PENDING") {
     buttonText = "Request Pending";
     isButtonDisabled = true;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Header */}
      <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-10 border border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-indigo-950" />
        {/* Placeholder decorative grid */}
        <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay opacity-20" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${event.isPublic ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
              {event.isPublic ? 'PUBLIC EVENT' : 'PRIVATE EVENT'}
            </span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${event.isFree ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
              {event.isFree ? 'FREE' : `$${event.fee} ENTRY`}
            </span>
            {event.category && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {event.category.toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <section className="glass-card p-8 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Event Description</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
          </section>

          <section className="glass-card p-8 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Organizer</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-700 rounded-full border-2 border-slate-600 flex items-center justify-center overflow-hidden">
                {event.organizer.avatar ? (
                  <img src={event.organizer.avatar} alt={event.organizer.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-slate-300">{event.organizer.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{event.organizer.name}</h3>
                <p className="text-slate-400 text-sm">Event Organizer</p>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="glass-card p-8 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4 flex items-center justify-between">
              <span>Reviews ({reviews.length})</span>
              <div className="flex items-center gap-1 text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-yellow-500">
                 <Star className="w-4 h-4 fill-current text-yellow-500" />
                 <span className="font-bold text-white">
                   {reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "New"}
                 </span>
              </div>
            </h2>
            
            {/* Show review form if user is an approved participant */}
            {userParticipantStatus === "APPROVED" && (
               <form onSubmit={handleSubmitReview} className="mb-8 p-5 bg-slate-800/50 rounded-xl border border-slate-700">
                 <h3 className="text-white font-bold mb-3">Leave a Review</h3>
                 <div className="flex gap-1 mb-4">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button
                       type="button"
                       key={star}
                       onClick={() => setNewReviewRating(star)}
                       className={`p-1 ${star <= newReviewRating ? 'text-yellow-400' : 'text-slate-600'}`}
                     >
                       <Star className="w-6 h-6 fill-current focus:outline-none" />
                     </button>
                   ))}
                 </div>
                 <textarea
                   value={newReviewComment}
                   onChange={(e) => setNewReviewComment(e.target.value)}
                   placeholder="Share your experience..."
                   className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 mb-3 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-slate-500"
                   rows={3}
                   required
                 />
                 <div className="flex justify-end">
                   <button 
                     type="submit" 
                     disabled={isSubmittingReview}
                     className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                   >
                     {isSubmittingReview && <Loader2 className="w-4 h-4 animate-spin" />}
                     Submit Review
                   </button>
                 </div>
               </form>
            )}

            {/* List Reviews */}
            {reviews.length === 0 ? (
               <div className="text-center py-8">
                 <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                   <MessageSquare className="w-5 h-5 text-slate-500" />
                 </div>
                 <p className="text-slate-400">No reviews yet. Be the first to share your experience!</p>
               </div>
            ) : (
               <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                 {reviews.map((review) => (
                   <div key={review.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-700 rounded-full flex flex-shrink-0 items-center justify-center overflow-hidden border border-slate-600/50">
                              {review.user?.avatar ? (
                                <img src={review.user.avatar} alt="User" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-sm font-bold text-slate-300">{review.user?.name?.charAt(0) || "U"}</span>
                              )}
                            </div>
                            <div>
                               <p className="text-white font-medium text-sm">{review.user?.name || "Anonymous User"}</p>
                               <span className="text-xs text-slate-500">{format(new Date(review.createdAt), "MMM d, yyyy")}</span>
                            </div>
                         </div>
                         <div className="flex gap-0.5">
                           {[1, 2, 3, 4, 5].map((star) => (
                             <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                           ))}
                         </div>
                      </div>
                      <p className="text-slate-300 text-sm mt-3 ml-13 pl-13 leading-relaxed">{review.comment}</p>
                   </div>
                 ))}
               </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-700 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-6 mb-2">Details</h3>
            
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Date</p>
                  <p className="text-white font-medium">{format(new Date(event.date), 'EEEE, MMMM do, yyyy')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Time</p>
                  <p className="text-white font-medium">{event.time}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Location</p>
                  <p className="text-white font-medium">{event.venue}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700">
              <button
                onClick={buttonAction}
                disabled={isButtonDisabled}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-lg ${
                  isOwner 
                    ? "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                    : isButtonDisabled
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 hover:-translate-y-1"
                }`}
              >
                {actionLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {!actionLoading && isButtonDisabled && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {buttonText}
              </button>
            </div>
            
            {/* Disclaimer for private events */}
            {!event.isPublic && !isOwner && (
              <p className="text-xs text-slate-500 mt-4 text-center flex items-center justify-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                Requires organizer approval to attend.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
