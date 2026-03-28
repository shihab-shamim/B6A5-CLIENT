import Link from "next/link";
import { Calendar, Twitter, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0b1120] border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                Planora
              </span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              The premium platform for creating, managing, and discovering incredible events happening around you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/events" className="text-slate-400 hover:text-white text-sm transition-colors">All Events</Link></li>
              <li><Link href="/events?category=technology" className="text-slate-400 hover:text-white text-sm transition-colors">Tech Conferences</Link></li>
              <li><Link href="/events?category=music" className="text-slate-400 hover:text-white text-sm transition-colors">Music Festivals</Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Host an Event</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-400 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">Stay Updated</h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to our newsletter for the latest events.
            </p>
            <form className="flex flex-col gap-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Planora Platforms Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-slate-600 text-sm font-medium tracking-wider">
              YOUR PREMIER EVENT PARTNER
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
