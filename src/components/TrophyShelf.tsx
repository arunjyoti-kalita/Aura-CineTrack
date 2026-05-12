import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, CheckCircle2, Globe, Film, Tv, Award } from 'lucide-react';
import { Entry, Badge } from '../types';
import { BADGE_DEFINITIONS } from '../constants';
import { cn } from '../lib/utils';

interface TrophyShelfProps {
  entries: Entry[];
}

export function TrophyShelf({ entries }: TrophyShelfProps) {
  const completedEntries = entries.filter(e => e.status === 'Completed');
  const ratedEntries = entries.filter(e => e.myRating > 0);
  const uniqueCountries = new Set(entries.map(e => e.country)).size;
  const uniqueGenres = new Set(entries.map(e => e.genre)).size;
  
  const badges: Badge[] = BADGE_DEFINITIONS.map(def => {
    let current = 0;
    switch (def.id) {
      case 'first-watch': current = completedEntries.length; break;
      case 'on-fire': 
        // Simple streak logic for demo
        current = completedEntries.length >= 5 ? 5 : completedEntries.length;
        break;
      case 'world-cinema': current = uniqueCountries; break;
      case 'genre-hopper': current = uniqueGenres; break;
      case 'critic-mode': current = ratedEntries.length; break;
      case 'binge-master': current = entries.some(e => e.type === 'Web Series' && e.status === 'Completed') ? 1 : 0; break;
      case 'cinephile': current = completedEntries.length; break;
    }
    
    return {
      ...def,
      current,
      unlocked: current >= def.requirement
    };
  });

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-3xl font-black text-white uppercase tracking-tight font-display">Trophy Shelf</h3>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Your cinematic achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "relative group p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
              badge.unlocked 
                ? "bg-zinc-900/50 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]" 
                : "bg-black/40 border-white/5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
            )}
          >
            {/* Background Glow */}
            {badge.unlocked && (
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full group-hover:bg-blue-500/40 transition-colors duration-1000" />
            )}

            <div className="relative z-10 space-y-6">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                badge.unlocked ? "bg-blue-500 text-white" : "bg-zinc-800 text-gray-500"
              )}>
                {badge.icon}
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">{badge.title}</h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">{badge.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className={badge.unlocked ? "text-blue-500" : "text-gray-500"}>
                    {badge.unlocked ? "UNLOCKED" : "PROGRESS"}
                  </span>
                  <span className="text-gray-500">{badge.current}/{badge.requirement}</span>
                </div>
                <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min((badge.current / badge.requirement) * 100, 100)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      badge.unlocked ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-zinc-700"
                    )}
                  />
                </div>
              </div>
            </div>

            {badge.unlocked && (
              <div className="absolute top-6 right-6">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
