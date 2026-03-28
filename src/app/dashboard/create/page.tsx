"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Save, Ban, Loader2, DollarSign, MapPin, AlignLeft, Calendar as CalendarIcon, Clock, Type } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    eventLink: "",
    isPublic: "true",
    isFree: "true",
    fee: "",
    category: "Technology"
  });

  const categories = ["Technology", "Music", "Business", "Education", "Health", "Sports", "Other"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        isPublic: formData.isPublic === "true",
        isFree: formData.isFree === "true",
        fee: formData.isFree === "true" ? 0 : parseFloat(formData.fee || "0")
      };

      const { data } = await api.post("/events", payload);
      toast.success("Event created successfully!");
      router.push(`/events/${data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create event");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-white">Create New Event</h1>
            <p className="text-sm text-slate-400">Fill in the details below to publish your event.</p>
         </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-700 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
             <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">Basic Info</h3>
             
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Event Title *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="E.g., Global Tech Summit 2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description *</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <AlignLeft className="h-4 w-4 text-slate-500" />
                  </div>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
                    placeholder="Describe your event in detail..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                 </div>
              </div>
          </div>

          <div className="space-y-4 pt-4">
             <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">When & Where</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Date *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-4 w-4 text-slate-500" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all [&::-webkit-calendar-picker-indicator]:invert"
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Time *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 text-slate-500" />
                      </div>
                      <input
                        type="time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all [&::-webkit-calendar-picker-indicator]:invert"
                      />
                    </div>
                 </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Venue Location *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="venue"
                    required
                    value={formData.venue}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Physical address or 'Online'"
                  />
                </div>
              </div>
          </div>

          <div className="space-y-4 pt-4">
             <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">Access & Pricing</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">Privacy Setting</label>
                    <div className="flex gap-4">
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" name="isPublic" value="true" checked={formData.isPublic === "true"} onChange={handleChange} className="text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-600" />
                         <span className="text-sm text-white">Public (Anyone can see)</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" name="isPublic" value="false" checked={formData.isPublic === "false"} onChange={handleChange} className="text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-600" />
                         <span className="text-sm text-white">Private (Invite only)</span>
                       </label>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">Entry Fee</label>
                    <div className="flex gap-4">
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" name="isFree" value="true" checked={formData.isFree === "true"} onChange={handleChange} className="text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-600" />
                         <span className="text-sm text-white">Free</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" name="isFree" value="false" checked={formData.isFree === "false"} onChange={handleChange} className="text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-600" />
                         <span className="text-sm text-white">Paid</span>
                       </label>
                    </div>
                 </div>
             </div>

             {formData.isFree === "false" && (
                <div className="mt-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Ticket Price (USD)</label>
                  <div className="relative max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="number"
                      name="fee"
                      required={formData.isFree === "false"}
                      value={formData.fee}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>
             )}
          </div>

          <div className="pt-6 border-t border-slate-700 flex justify-end gap-3">
             <Link 
               href="/dashboard"
               className="px-6 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
             >
               <Ban className="w-4 h-4" /> Cancel
             </Link>
             <button
               type="submit"
               disabled={loading}
               className="px-6 py-2.5 rounded-xl border border-transparent bg-blue-600 text-white font-medium hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
             >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               Publish Event
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
