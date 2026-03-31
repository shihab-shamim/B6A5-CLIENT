"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Check, X, ShieldAlert, Ban, Loader2, ArrowLeft, MailWarning } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { format } from "date-fns";

export default function EventParticipantsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const router = useRouter();


  const [participants, setParticipants] = useState<any[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      const [eventRes, partsRes] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.get(`/events/${eventId}/participants`)
      ]);
      setEvent(eventRes.data);
      setParticipants(partsRes.data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load participants");
      if (error.response?.status === 403) {
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (participantId: string, status: string) => {
    try {
      await api.put(`/participants/${participantId}`, { status });
      toast.success(`Participant ${status.toLowerCase()} successfully`);
      setParticipants(parts => parts.map(p => 
        p.id === participantId ? { ...p, status } : p
      ));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    try {
      await api.post(`/events/${eventId}/invite`, { inviteeEmail: inviteEmail });
      toast.success("Invitation sent successfully!");
      setInviteEmail("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const pending = participants.filter(p => p.status === "PENDING");
  const approved = participants.filter(p => p.status === "APPROVED");
  const rejected = participants.filter(p => p.status === "REJECTED" || p.status === "BANNED");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 mb-2">
             <ArrowLeft className="w-4 h-4" /> Back to Events
           </Link>
          <h1 className="text-2xl font-bold text-white">Manage Participants</h1>
          <p className="text-sm text-slate-400">{event?.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Requests */}
        <div className="col-span-1 md:col-span-3 lg:col-span-2 space-y-6">
           <div className="glass-card rounded-2xl border border-slate-700 p-6">
             <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <ShieldAlert className="w-5 h-5 text-orange-400" />
               Pending Approvals ({pending.length})
             </h2>
             
             {pending.length === 0 ? (
                <p className="text-slate-400 text-sm p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
                  No pending requests right now.
                </p>
             ) : (
                 <div className="space-y-3">
                  {pending.map(p => (
                    <div key={p.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-300">
                           {p.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {p.user.name}
                            {p.paidAmount > 0 ? (
                              <span className="ml-3 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                Paid ${p.paidAmount}
                              </span>
                            ) : (
                              <span className="ml-3 px-2 py-0.5 bg-slate-500/20 text-slate-400 text-xs rounded-full border border-slate-500/30">
                                Unpaid
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{p.user.email} • Requested {format(new Date(p.createdAt), "MMM d")}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handleUpdateStatus(p.id, "REJECTED")}
                          className="flex-1 sm:flex-none p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                        >
                          <X className="w-5 h-5 mx-auto" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(p.id, "APPROVED")}
                          className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-1"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             )}
           </div>

           <div className="glass-card rounded-2xl border border-slate-700 p-6">
             <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Check className="w-5 h-5 text-green-400" />
               Approved Participants ({approved.length})
             </h2>
             
             {approved.length === 0 ? (
                <p className="text-slate-400 text-sm p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
                  No approved participants yet.
                </p>
             ) : (
                <div className="space-y-3">
                  {approved.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-300 text-sm">
                           {p.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {p.user.name}
                            {p.paidAmount > 0 && (
                              <span className="ml-2 text-green-400 text-xs font-bold">Paid ${p.paidAmount}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleUpdateStatus(p.id, "BANNED")}
                        title="Ban User"
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
             )}
           </div>
        </div>

        {/* Sidebar Stats */}
        <div className="col-span-1 lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="glass-card rounded-2xl border border-slate-700 p-6">
              <h3 className="text-white font-bold mb-4">Event Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <span className="text-slate-400 text-sm">Total Capacity</span>
                  <span className="text-white font-medium">Unlimited</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <span className="text-slate-400 text-sm">Approved</span>
                  <span className="text-green-400 font-bold">{approved.length}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <span className="text-slate-400 text-sm">Pending</span>
                  <span className="text-orange-400 font-bold">{pending.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Rejected/Banned</span>
                  <span className="text-red-400 font-bold">{rejected.length}</span>
                </div>
              </div>
              
              {!event?.isFree && (
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Estimated Revenue</p>
                  <p className="text-2xl font-bold text-white">${approved.length * event.fee}</p>
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl border border-slate-700 p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <MailWarning className="w-5 h-5 text-indigo-400" />
                Invite Users
              </h3>
              <p className="text-sm text-slate-400 mb-4">Send an email invitation directly to a user registered on Planora.</p>
              <form onSubmit={handleInvite} className="space-y-3">
                <input
                  type="email"
                  placeholder="User's email address..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
                <button 
                  type="submit"
                  disabled={inviting || !inviteEmail}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {inviting ? "Sending..." : "Send Invite"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
