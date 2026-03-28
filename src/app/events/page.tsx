"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import EventCard from "@/components/events/EventCard";
import { Search, Filter, SlidersHorizontal, Loader2, CalendarX2 } from "lucide-react";

function EventsContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") || "All";
  const initialCategory = searchParams.get("category") || "All";

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState(initialFilter); // All, Public Free, Public Paid, Private Free, Private Paid
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const categories = ["All", "Technology", "Music", "Business", "Education", "Health", "Sports", "Other"];
  const filters = ["All", "Public Free", "Public Paid", "Private Free", "Private Paid"];

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, activeFilter, activeCategory]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();
      
      if (searchTerm) queryParams.append("search", searchTerm);
      if (activeCategory !== "All") queryParams.append("category", activeCategory);

      if (activeFilter !== "All") {
        if (activeFilter.includes("Public")) queryParams.append("isPublic", "true");
        if (activeFilter.includes("Private")) queryParams.append("isPublic", "false");
        if (activeFilter.includes("Free")) queryParams.append("isFree", "true");
        if (activeFilter.includes("Paid")) queryParams.append("isFree", "false");
      }

      const { data } = await api.get(`/events?${queryParams.toString()}`);
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Explore Events</h1>
          <p className="text-slate-400">Find and join the best events happening globally.</p>
        </div>
        
        {/* Search */}
        <div className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-lg"
            placeholder="Search events, organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          {/* Access Filters */}
          <div className="glass-card rounded-xl border border-slate-700 p-5 hidden md:block">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-400" />
              Access Type
            </h3>
            <div className="space-y-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeFilter === filter
                      ? "bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="glass-card rounded-xl border border-slate-700 p-5 hidden md:block">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-400" />
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat
                      ? "bg-indigo-600/20 text-indigo-400 font-medium border border-indigo-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile Filter Dropdowns (only visible on small screens) */}
          <div className="flex flex-col sm:flex-row gap-4 md:hidden">
             <select 
               value={activeFilter}
               onChange={(e) => setActiveFilter(e.target.value)}
               className="bg-slate-800 border-slate-700 text-white rounded-lg p-3 w-full"
             >
                {filters.map(f => <option key={f} value={f}>{f}</option>)}
             </select>
             <select 
               value={activeCategory}
               onChange={(e) => setActiveCategory(e.target.value)}
               className="bg-slate-800 border-slate-700 text-white rounded-lg p-3 w-full"
             >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>
        </div>

        {/* Event Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-slate-400">Finding experiences matching your criteria...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 glass-card rounded-2xl border border-dashed border-slate-700 text-center px-4">
               <div className="bg-slate-800/50 p-4 rounded-full mb-4">
                  <CalendarX2 className="w-12 h-12 text-slate-500" />
               </div>
              <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
              <p className="text-slate-400 max-w-md">
                We couldn't find any events matching your current filters. Try adjusting your search criteria.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("All");
                  setActiveCategory("All");
                }}
                className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}
