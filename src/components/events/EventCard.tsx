import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface EventProps {
  event: any;
}

export default function EventCard({ event }: EventProps) {
  const isFree = event.isFree || event.fee === 0;

  return (
    <div className="relative glass-card rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group flex flex-col h-full">
      {/* Date badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg border border-slate-700">
          <div className="flex flex-col px-2">
            <span className="text-xs text-blue-400 font-bold uppercase">{format(new Date(event.date), 'MMM')}</span>
            <span className="text-xl font-bold text-white">{format(new Date(event.date), 'dd')}</span>
          </div>
        </div>
      </div>

      {/* Type badge */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${event.isPublic ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
          {event.isPublic ? 'PUBLIC' : 'PRIVATE'}
        </span>
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${isFree ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
          {isFree ? 'FREE' : `$${event.fee}`}
        </span>
      </div>

      {/* Image placeholder dummy */}
      <div className="h-48 bg-slate-800 w-full relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-800 opacity-50 group-hover:scale-105 transition-transform duration-500" />
        <div className="w-full h-full flex items-center justify-center relative z-0">
           <Calendar className="w-12 h-12 text-slate-600 opacity-30" />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">
          {event.description}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-slate-300">
            <Calendar className="w-4 h-4 mr-2 text-blue-400" />
            {format(new Date(event.date), 'EEEE, MMMM do, yyyy')} • {event.time}
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <MapPin className="w-4 h-4 mr-2 text-blue-400" />
            <span className="truncate">{event.venue}</span>
          </div>
          {event.organizer && (
            <div className="flex items-center text-sm text-slate-300">
              <div className="w-5 h-5 rounded-full bg-slate-700 mr-2 flex items-center justify-center overflow-hidden">
                {event.organizer.avatar ? (
                  <img src={event.organizer.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold">{event.organizer.name.charAt(0)}</span>
                )}
              </div>
              <span className="truncate">By {event.organizer.name}</span>
            </div>
          )}
        </div>

        <Link 
          href={`/events/${event.id}`}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-medium text-center transition-all duration-300 border border-slate-700 hover:border-blue-500"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
