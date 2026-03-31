"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Star, Trash2, Edit, Save, X, Loader2, MessageSquareOff } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  
  const { user } = useAuth();

  useEffect(() => {
    fetchMyReviews();
  }, [user]);



  const fetchMyReviews = async () => {
    try {
      if (!user) return;
      
      
      const { data } = await api.get("/reviews/me").catch(() => ({ data: [] }));
      setReviews(data);
      
    } catch (error) {
      console.error(error);
   
    } finally {
      setLoading(false);
    }
  };

  const handleEditInit = (review: any) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/reviews/${id}`, { rating: editRating, comment: editComment });
      toast.success("Review updated");
      setReviews(reviews.map(r => r.id === id ? { ...r, rating: editRating, comment: editComment } : r));
      setEditingId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success("Review deleted");
      setReviews(reviews.filter(r => r.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">My Reviews</h1>
        <p className="text-sm text-slate-400">Manage the feedback you've left for events.</p>
      </div>

      <div className="glass-card rounded-2xl border border-slate-700 p-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              <MessageSquareOff className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No reviews yet</h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
              You haven't left any reviews. Attend an event and share your experience!
            </p>
            <Link 
              href="/events" 
              className="inline-flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-600 transition-all"
            >
              Find Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-5 bg-slate-800/50 border border-slate-700 rounded-xl transition-colors">
                
                {editingId === review.id ? (
                   <div className="space-y-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setEditRating(star)}
                            className={`p-1 ${star <= editRating ? 'text-yellow-400' : 'text-slate-600'}`}
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                         <button 
                           onClick={() => setEditingId(null)}
                           className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                         >
                           <X className="w-4 h-4" /> Cancel
                         </button>
                         <button 
                           onClick={() => handleUpdate(review.id)}
                           className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-1"
                         >
                           <Save className="w-4 h-4" /> Save Replace
                         </button>
                      </div>
                   </div>
                ) : (
                   <>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-white text-lg"><Link href={`/events/${review.eventId}`} className="hover:text-blue-400">{review.event?.title || "Unknown Event"}</Link></h3>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="flex gap-0.5">
                               {[1, 2, 3, 4, 5].map((star) => (
                                 <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                               ))}
                             </div>
                             <span className="text-xs text-slate-500">{format(new Date(review.createdAt), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => handleEditInit(review)}
                             className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                           >
                              <Edit className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => handleDelete(review.id)}
                             className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                      {review.comment && (
                         <p className="text-slate-300 text-sm mt-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">"{review.comment}"</p>
                      )}
                   </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
