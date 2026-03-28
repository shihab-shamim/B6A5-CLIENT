"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar as CalendarIcon, Tag, Zap, Shield, Users } from "lucide-react";
import EventSlider from "@/components/events/EventSlider";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 overflow-hidden">
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-10">
        {/* Background elements */}
        <div className="absolute top-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[150px]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6 text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>The new standard for events</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Discover <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  Extraordinary
                </span> <br/> 
                Experiences.
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
                Planora connects you with the best exclusive gatherings, massive conferences, and secret parties happening right now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/events" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1">
                  Explore Events <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full glass hover:bg-slate-800 text-white font-medium transition-all">
                  Host an Event
                </Link>
              </div>
            </motion.div>

            {/* Featured Event Card Placeholder in Hero */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="glass-card p-6 rounded-2xl border border-slate-700 relative overflow-hidden group">
                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/30 blur-[50px] rounded-full group-hover:bg-blue-400/40 transition-colors" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      FEATURED
                    </span>
                    <div className="flex bg-slate-800 rounded-lg p-2 text-center shadow-inner">
                      <div className="flex flex-col px-2">
                        <span className="text-xs text-slate-400 uppercase">Oct</span>
                        <span className="text-xl font-bold text-white">24</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-48 bg-slate-800 rounded-xl mb-6 overflow-hidden relative">
                    {/* Placeholder image representation */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-indigo-600/40 mix-blend-overlay" />
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <CalendarIcon className="w-12 h-12 opacity-50" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">Global Tech Summit 2026</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    Join industry leaders for a three-day intensive conference covering AI, Web3, and the future of development.
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      San Francisco, CA
                    </div>
                    <div className="font-semibold text-white">
                      $299
                    </div>
                  </div>

                  <Link href="/events" className="w-full block text-center py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl font-medium transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 2: SLIDER */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Experiences</h2>
              <p className="text-slate-400">Don't miss out on these popular events.</p>
            </div>
            <Link href="/events" className="hidden sm:flex text-blue-400 hover:text-blue-300 items-center gap-1 font-medium text-sm transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <EventSlider />
        </div>
      </section>

      {/* SECTION 3: CATEGORIES */}
      <section className="py-12 bg-slate-800/30 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Find exactly what you're looking for using our curated event categories.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Public Free", icon: Users, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
              { title: "Public Paid", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { title: "Private Free", icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
              { title: "Private Paid", icon: Tag, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" }
            ].map((cat, i) => (
              <Link key={i} href={`/events?filter=${cat.title.replace(" ", "")}`} className="group">
                <div className={`glass-card p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${cat.border} flex flex-col items-center justify-center text-center h-full gap-4`}>
                  <div className={`p-4 rounded-full ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-lg">{cat.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10" />
        <div className="absolute w-[800px] h-[800px] bg-blue-500/20 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to create your own event?</h2>
          <p className="text-xl text-slate-300 mb-10">
            Join thousands of organizers who use Planora to host spectacular events. Set up your first event in minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1">
              Start for free
            </Link>
            <Link href="/events" className="px-8 py-4 rounded-xl glass hover:bg-slate-800 text-white font-bold text-lg border border-slate-600 transition-all">
              Discover events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
