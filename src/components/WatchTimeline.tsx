import React from 'react';
import { motion } from 'motion/react';
import { Star, Calendar, Quote, ChevronRight } from 'lucide-react';
import { Entry } from '../types';
import { format } from 'date-fns';

import { Poster } from './Poster';

interface WatchTimelineProps {
  entries: Entry[];
  onSelect: (entry: Entry) => void;
}

export function WatchTimeline({ entries, onSelect }: WatchTimelineProps) {
  const recentWatches = entries
    .filter(e => e.status === 'Completed' && e.watchedDate)
    .sort((a, b) => new Date(b.watchedDate!).getTime() - new Date(a.watchedDate!).getTime())
    .slice(0, 5);

  if (recentWatches.length === 0) return null;

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-3xl font-black text-white uppercase tracking-tight font-display">Recently Watched</h3>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Your personal cinema diary</p>
        </div>
      </div>

      <div className="relative pl-12 space-y-12 before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-transparent">
        {recentWatches.map((entry, idx) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative group"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-12 top-0 w-12 h-12 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-150 transition-transform duration-500" />
            </div>

            <div 
              onClick={() => onSelect(entry)}
              className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 hover:border-blue-500/30 transition-all duration-500 cursor-pointer flex flex-col md:flex-row gap-8 items-center group"
            >
              <div className="w-24 h-36 rounded-2xl overflow-hidden shrink-0 shadow-2xl">
                <Poster 
                  entry={entry}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(entry.watchedDate!), 'MMM dd, yyyy')}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-bold">{entry.myRating}/10</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-blue-500 transition-colors group-hover:translate-x-2 duration-500" />
                </div>

                <h4 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">
                  {entry.title}
                </h4>

                <div className="flex items-start gap-3 bg-black/40 p-4 rounded-2xl border border-white/5">
                  <Quote className="w-4 h-4 text-gray-700 shrink-0 mt-1" />
                  <p className="text-sm font-bold text-gray-500 italic line-clamp-2 leading-relaxed">
                    {entry.review || "No review written yet..."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
