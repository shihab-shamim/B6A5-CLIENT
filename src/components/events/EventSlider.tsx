"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./EventCard";
import api from "@/lib/api";

export default function EventSlider() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const { data } = await api.get("/events/upcoming");
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden w-full h-[450px]">
        {[1, 2, 3].map((n) => (
          <div key={n} className="min-w-[350px] md:min-w-[400px] h-full glass-card rounded-2xl animate-pulse bg-slate-800 border-slate-700" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full h-48 border border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 bg-slate-800/20">
        No upcoming events found. Be the first to host one!
      </div>
    );
  }

  return (
    <div className="relative group/slider w-full">
      {/* Navigation Buttons */}
      <button 
        onClick={slideLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-1/4 z-10 w-12 h-12 rounded-full glass flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-slate-700 shadow-xl border border-slate-600 focus:outline-none"
      >
        <ChevronLeft className="w-6 h-6 ml-[-2px]" />
      </button>
      
      {/* Slider Container */}
      <div 
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 pt-4 px-4 -mx-4 items-stretch"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {events.map((event) => (
          <div key={event.id} className="min-w-[300px] sm:min-w-[350px] md:min-w-[400px] snap-center">
            <EventCard event={event} />
          </div>
        ))}
      </div>

      <button 
        onClick={slideRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-1/4 z-10 w-12 h-12 rounded-full glass flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-slate-700 shadow-xl border border-slate-600 focus:outline-none"
      >
        <ChevronRight className="w-6 h-6 mr-[-2px]" />
      </button>

      {/* Global style to hide scrollbar specifically for the slider */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
