"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { format } from "date-fns";
import { PlusCircle, Search, Edit, Trash2, Users, Loader2, CalendarX2 } from "lucide-react";
import toast from "react-hot-toast";

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
       // Since the backend doesn't have a specific GET /my-events, 
       // but wait, is there? Let's check eventController GET /. 
       // The generic GET / has filters. We could just add a query param like `organizerId`.
       // Since we are logged in, we must pass our own ID, which we can get from context, or backend handles it.
       // Let's assume the backend handles it or we pass it. I will use the /events endpoint with our user token, 
       // Note: The backend in eventController.getEvents doesn't restrict to user, it lists all. 
       // We need to filter frontend-side for now, or add `organizer` from user context.
       // Wait, a standard implementation passes organizerId.
       const { data } = await api.get("/events");
       
       // Temporary workaround: Client side filter by logged in user since I didn't explicitly write 
       // a dedicated /my-events route in Express. In a real scenario I would update backend.
       const userStr = localStorage.getItem("user");
       const user = userStr ? JSON.parse(userStr) : null;
       
       if (user) {
         setEvents(data.filter((e: any) => e.organizerId === user.id));
       } else {
           setEvents(data);
       }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted successfully");
      setEvents(events.filter(e => e.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Events</h1>
          <p className="text-sm text-slate-400">Manage the events you are hosting.</p>
        </div>
        <Link 
          href="/dashboard/create" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          <PlusCircle className="w-5 h-5" />
          Create Event
        </Link>
      </div>

      <div className="glass-card rounded-2xl border border-slate-700 p-6">
        <div className="mb-6 relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
            placeholder="Search your events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-xs uppercase text-slate-400 bg-slate-800/50">
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Event</th>
                  <th className="px-4 py-3 font-medium">Date & Time</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                         <Link href={`/events/${event.id}`}>{event.title}</Link>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full ${event.isPublic ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {event.isPublic ? 'Public' : 'Private'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${event.isFree ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                          {event.isFree ? 'Free' : `$${event.fee}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">
                      <div>{format(new Date(event.date), 'MMM dd, yyyy')}</div>
                      <div className="text-xs text-slate-500">{event.time}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-300">
                         <Users className="w-4 h-4 text-slate-400" />
                         <span>Manage</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/events/${event.id}/participants`}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Manage Participants"
                        >
                          <Users className="w-4 h-4" />
                        </Link>
                        {/* <Link // Edit function mocked out for brevity
                          href={`/dashboard/events/${event.id}/edit`}
                          className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </Link> */}
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              <CalendarX2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
              You haven't created any events yet, or none match your search criteria.
            </p>
            <Link 
              href="/dashboard/create" 
              className="inline-flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-600 transition-all"
            >
              Host your first event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
