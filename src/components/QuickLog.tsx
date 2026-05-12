import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Star, Film, Tv } from 'lucide-react';
import { Entry, EntertainmentType } from '../types';
import { cn } from '../lib/utils';
import { POPULAR_COUNTRIES } from '../constants';

import { PrefixIndex } from '../lib/search';
import { POPULAR_TITLES } from '../lib/popularMovies';

interface QuickLogProps {
  onSave: (entry: Entry) => void;
  allEntries?: Entry[];
}

export function QuickLog({ onSave, allEntries = [] }: QuickLogProps) {
  const prefixIndex = React.useMemo(() => {
    const localTitles = allEntries.map(e => e.title);
    return new PrefixIndex([...new Set([...localTitles, ...POPULAR_TITLES])]);
  }, [allEntries]);

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [type, setType] = useState<EntertainmentType>('Movie');
  const [leadActor, setLeadActor] = useState('');
  const [leadActress, setLeadActress] = useState('');
  const [country, setCountry] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEntry: Entry = {
      id: crypto.randomUUID(),
      title,
      type,
      year: new Date().getFullYear(),
      director: 'Unknown',
      genre: 'Unknown',
      leadActor: leadActor || 'Unknown',
      leadActress: leadActress || 'Unknown',
      supportingActor: 'Unknown',
      platform: 'Other',
      country: country || 'Unknown',
      language: 'Unknown',
      runtime: 0,
      episodesWatched: 0,
      imdbRating: 0,
      myRating: rating,
      status: 'Completed',
      watchedDate: new Date().toISOString(),
      rewatchable: false,
      mood: 'Anytime',
      basedOn: 'Original',
      review,
      posterUrl: posterUrl || '',
      addedAt: new Date().toISOString(),
    };

    onSave(newEntry);
    setTitle('');
    setLeadActor('');
    setLeadActress('');
    setCountry('');
    setPosterUrl('');
    setRating(0);
    setReview('');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-blue-500 text-white px-6 py-4 rounded-full font-black uppercase tracking-widest shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
        LOG IT
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Quick Log</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Title</label>
                  <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTitle(val);
                      if (val.length > 1) {
                        const matches = prefixIndex.search(val);
                        setSuggestions(matches.slice(0, 5));
                        setShowSuggestions(true);
                      } else {
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }
                    }}
                    onFocus={() => title.length > 1 && setShowSuggestions(true)}
                    placeholder="What did you watch?"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                  
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden p-1"
                      >
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setTitle(s);
                              setShowSuggestions(false);
                            }}
                            className="w-full px-4 py-3 text-left text-xs font-bold text-white hover:bg-white/5 rounded-xl transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lead Actor</label>
                    <input
                      type="text"
                      value={leadActor}
                      onChange={(e) => setLeadActor(e.target.value)}
                      placeholder="Actor"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lead Actress</label>
                    <input
                      type="text"
                      value={leadActress}
                      onChange={(e) => setLeadActress(e.target.value)}
                      placeholder="Actress"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Country</label>
                  <input
                    list="quick-popular-countries"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. South Korea"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                  <datalist id="quick-popular-countries">
                    {POPULAR_COUNTRIES.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setType('Movie')}
                    className={cn(
                      "flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest",
                      type === 'Movie' ? "bg-blue-500/20 border-blue-500 text-blue-500" : "bg-black/40 border-white/5 text-gray-500"
                    )}
                  >
                    <Film className="w-4 h-4" /> Movie
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('Web Series')}
                    className={cn(
                      "flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest",
                      type === 'Web Series' ? "bg-green-500/20 border-green-500 text-green-500" : "bg-black/40 border-white/5 text-gray-500"
                    )}
                  >
                    <Tv className="w-4 h-4" /> Series
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={cn(
                          "flex-1 aspect-square rounded-lg flex items-center justify-center text-xs font-black transition-all",
                          rating >= num ? "bg-yellow-500 text-black" : "bg-zinc-800 text-gray-500 hover:bg-zinc-700"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Poster URL (Optional)</label>
                  <input
                    type="text"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    placeholder="Paste image link..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">One-line Review</label>
                  <input
                    type="text"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Short and sweet..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  SAVE LOG
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
