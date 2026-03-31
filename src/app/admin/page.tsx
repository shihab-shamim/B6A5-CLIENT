"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Trash2, ShieldCheck, Users, CalendarDays, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";




export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, eventsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/events")
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, role: string) => {
    if (role === 'ADMIN') {
        toast.error("Cannot delete fellow administrators.");
        return;
    }
    if (!window.confirm("Are you sure? This will remove the user and all their associations.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      toast.success("User deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting user");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm("Delete this event globally? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
      toast.success("Event deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting event");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] justify-center items-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
         </div>
         <div>
            <h1 className="text-3xl font-bold text-white">System Administration</h1>
            <p className="text-slate-400">Monitor and manage all platform activity.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="glass-card p-6 rounded-2xl border border-slate-700 flex items-center gap-6">
            <div className="p-4 bg-blue-500/10 rounded-full">
               <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div>
               <p className="text-slate-400 text-sm font-medium">Total Users</p>
               <h3 className="text-3xl font-bold text-white">{users.length}</h3>
            </div>
         </div>
         <div className="glass-card p-6 rounded-2xl border border-slate-700 flex items-center gap-6">
            <div className="p-4 bg-purple-500/10 rounded-full">
               <CalendarDays className="w-8 h-8 text-purple-400" />
            </div>
            <div>
               <p className="text-slate-400 text-sm font-medium">Platform Events</p>
               <h3 className="text-3xl font-bold text-white">{events.length}</h3>
            </div>
         </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-700 overflow-hidden">
         <div className="flex border-b border-slate-700">
            <button 
              onClick={() => setActiveTab("users")}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'users' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              Manage Users
            </button>
            <button 
              onClick={() => setActiveTab("events")}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'events' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              Manage Events
            </button>
         </div>

         <div className="p-6">
            <div className="p-4 mb-6 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3">
               <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
               <p className="text-sm text-orange-300">
                 <strong>Admin Warning:</strong> Deletions performed here are permanent and cascade to connected records (participants, reviews, etc). Proceed with caution.
               </p>
            </div>

            {activeTab === 'users' && (
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-xs uppercase text-slate-500 border-b border-slate-700/50">
                       <th className="pb-3 px-4">User</th>
                       <th className="pb-3 px-4">Role</th>
                       <th className="pb-3 px-4">Joined</th>
                       <th className="pb-3 px-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700/30">
                     {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                           <td className="py-4 px-4">
                              <div className="font-medium text-white">{u.name}</div>
                              <div className="text-xs text-slate-400">{u.email}</div>
                           </td>
                           <td className="py-4 px-4">
                              <span className={`px-2 py-1 text-xs font-bold rounded-full ${u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                                {u.role}
                              </span>
                           </td>
                           <td className="py-4 px-4 text-sm text-slate-300">
                             {new Date(u.createdAt).toLocaleDateString()}
                           </td>
                           <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(u.id, u.role)}
                                disabled={u.role === 'ADMIN'}
                                className={`p-2 rounded-lg transition-colors ${u.role === 'ADMIN' ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-red-400 hover:bg-red-400/10'}`}
                                title="Delete User"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                           </td>
                        </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            )}

            {activeTab === 'events' && (
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-xs uppercase text-slate-500 border-b border-slate-700/50">
                       <th className="pb-3 px-4">Event</th>
                       <th className="pb-3 px-4">Host</th>
                       <th className="pb-3 px-4">Status</th>
                       <th className="pb-3 px-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700/30">
                     {events.map(e => (
                        <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                           <td className="py-4 px-4">
                              <div className="font-medium text-white max-w-[250px] truncate">{e.title}</div>
                              <div className="text-xs text-slate-400">{new Date(e.date).toLocaleDateString()}</div>
                           </td>
                           <td className="py-4 px-4 text-sm text-slate-300">
                              {users.find(u => u.id === e.organizerId)?.name || 'Unknown'}
                           </td>
                           <td className="py-4 px-4">
                              <span className={`px-2 py-1 text-xs font-bold rounded-full ${e.isPublic ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                {e.isPublic ? 'Public' : 'Private'}
                              </span>
                           </td>
                           <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleDeleteEvent(e.id)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                title="Force Delete Event"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                           </td>
                        </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
