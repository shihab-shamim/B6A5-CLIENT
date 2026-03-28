"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Check, X, MailWarning, Loader2, Calendar as CalendarIcon, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { format } from "date-fns";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const { data } = await api.get("/invitations");
      setInvitations(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: "ACCEPTED" | "DECLINED") => {
    try {
      await api.put(`/invitations/${id}`, { status });
      toast.success(`Invitation ${status.toLowerCase()}`);
      setInvitations(invites => invites.filter(i => i.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process invitation");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const pendingInvites = invitations.filter(i => i.status === "PENDING");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">My Invitations</h1>
        <p className="text-sm text-slate-400">Manage your private event invitations.</p>
      </div>

      <div className="glass-card rounded-2xl border border-slate-700 p-6">
        {pendingInvites.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              <MailWarning className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No pending invitations</h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
              You're all caught up! Check out public events instead.
            </p>
            <Link 
              href="/events" 
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              Discover Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-3 inline-block">
                      INVITED
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1"><Link href={`/events/${invite.event.id}`} className="hover:text-blue-400 transition-colors">{invite.event.title}</Link></h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1">
                      From: <span className="text-white font-medium">{invite.inviter.name}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-slate-300">
                    <CalendarIcon className="w-4 h-4 mr-2 text-blue-400" />
                    {format(new Date(invite.event.date), 'MMM do, yyyy')} • {invite.event.time}
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                    <span className="truncate">{invite.event.venue}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(invite.id, "DECLINED")}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl border border-slate-600 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" /> Decline
                  </button>
                  <button
                    onClick={() => handleAction(invite.id, "ACCEPTED")}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
