import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Quote, Heart, MessageSquare, Calendar, Star, ThumbsUp, ThumbsDown, SortAsc, SortDesc } from 'lucide-react';
import { Entry } from '../types';
import { cn } from '../lib/utils';
import { Poster } from './Poster';

interface MyJournalProps {
  entries: Entry[];
  onSelect: (entry: Entry) => void;
}

export function MyJournal({ entries, onSelect }: MyJournalProps) {
  const [sortBy, setSortBy] = useState<'dateDesc' | 'dateAsc' | 'yearDesc' | 'yearAsc' | 'actor' | 'actress'>('actor');

  const journalEntries = useMemo(() => {
    return entries
      .filter(e => e.status === 'Completed' && (e.journalNotes || e.journalMood || e.memorableQuote))
      .sort((a, b) => {
        switch (sortBy) {
          case 'dateAsc': return new Date(a.watchedDate || 0).getTime() - new Date(b.watchedDate || 0).getTime();
          case 'yearDesc': return b.year - a.year;
          case 'yearAsc': return a.year - b.year;
          case 'actor': return a.leadActor.localeCompare(b.leadActor) || a.leadActress.localeCompare(b.leadActress);
          case 'actress': return a.leadActress.localeCompare(b.leadActress) || a.leadActor.localeCompare(b.leadActor);
          case 'dateDesc':
          default:
            return new Date(b.watchedDate || 0).getTime() - new Date(a.watchedDate || 0).getTime();
        }
      });
  }, [entries, sortBy]);

  if (journalEntries.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-8">
        <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto border border-white/5">
          <Book className="w-10 h-10 text-gray-600" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white uppercase tracking-tight font-display">Your Journal is Empty</h2>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            Start logging your cinematic thoughts! Mark a movie as "Completed" to add your first diary entry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Book className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter font-display">My Cinema Diary</h1>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] ml-16">
            {journalEntries.length} personal entries recorded
          </p>
        </div>

        <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 px-4">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sort By</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="dateDesc">Date Watched (Newest)</option>
            <option value="dateAsc">Date Watched (Oldest)</option>
            <option value="yearDesc">Release Year (Newest)</option>
            <option value="yearAsc">Release Year (Oldest)</option>
            <option value="actor">Lead Actor (A-Z)</option>
            <option value="actress">Lead Actress (A-Z)</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {journalEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(entry)}
            className="group relative bg-zinc-900/30 border border-white/5 rounded-[3rem] p-8 md:p-12 hover:bg-zinc-900/50 transition-all cursor-pointer overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-all" />

            <div className="relative z-10 flex flex-col md:flex-row gap-12">
              {/* Poster Section */}
              <div className="w-full md:w-64 shrink-0 space-y-6">
                <div className="aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                  <Poster 
                    entry={entry} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-xl font-black text-white">{entry.myRating}</span>
                  </div>
                  <div className="text-4xl">{entry.journalMood}</div>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-4xl font-black text-white uppercase tracking-tight font-display">{entry.title}</h2>
                      {entry.recommend && (
                        <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full flex items-center gap-1.5">
                          <ThumbsUp className="w-3 h-3 text-green-500" />
                          <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Recommended</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {entry.year} • {entry.director} • {entry.genre}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Watched: {new Date(entry.watchedDate || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Journal Notes */}
                <div className="relative p-8 bg-black/40 rounded-[2.5rem] border border-white/5 min-h-[150px]">
                  <MessageSquare className="absolute -top-3 -left-3 w-8 h-8 text-blue-500/20" />
                  <p className="text-lg font-medium text-gray-300 leading-relaxed italic">
                    "{entry.journalNotes}"
                  </p>
                </div>

                {/* Memorable Quote */}
                {entry.memorableQuote && (
                  <div className="flex items-start gap-6 p-8 bg-gradient-to-r from-purple-500/10 to-transparent rounded-[2rem] border border-purple-500/10">
                    <Quote className="w-8 h-8 text-purple-500 shrink-0" />
                    <div className="space-y-2">
                      <p className="text-xl font-black text-white italic tracking-tight leading-snug">
                        "{entry.memorableQuote}"
                      </p>
                      <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">— Memorable Dialogue</p>
                    </div>
                  </div>
                )}

                {/* Stats Row */}
                <div className="flex flex-wrap gap-4">
                  <div className="px-6 py-3 bg-zinc-800/50 rounded-2xl border border-white/5 flex items-center gap-3">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fav Character: <span className="text-white">{entry.favCharacter || 'N/A'}</span></span>
                  </div>
                  <div className="px-6 py-3 bg-zinc-800/50 rounded-2xl border border-white/5 flex items-center gap-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">IMDb: <span className="text-white">{entry.imdbRating}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
