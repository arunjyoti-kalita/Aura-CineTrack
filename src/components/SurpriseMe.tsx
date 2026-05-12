import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Star, Play, RotateCcw } from 'lucide-react';
import { Entry } from '../types';
import { cn } from '../lib/utils';

import { Poster } from './Poster';

interface SurpriseMeProps {
  entries: Entry[];
  onSelect: (entry: Entry) => void;
}

export function SurpriseMe({ entries, onSelect }: SurpriseMeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const watchlist = entries.filter(e => e.status === 'Want to Watch');

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.scrollBehavior = 'auto';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.scrollBehavior = '';
      if (scrollY) {
        window.scrollTo(0, Math.abs(parseInt(scrollY, 10)) || 0);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, [isOpen]);

  const handleSurprise = () => {
    if (watchlist.length === 0) return;
    
    setIsRevealing(true);
    setSelectedEntry(null);
    
    const timeoutId = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * watchlist.length);
      setSelectedEntry(watchlist[randomIndex]);
      setIsRevealing(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          handleSurprise();
        }}
        disabled={watchlist.length === 0}
        className="flex items-center gap-3 px-8 py-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-500 font-black uppercase tracking-widest text-xs hover:bg-purple-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 group"
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        Surprise Me
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-zinc-950/98 backdrop-blur-xl"
                style={{ touchAction: 'none' }}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row min-h-[500px]"
              >
                <div className="absolute top-8 right-8 z-50">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-gray-500 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Left Side: Oracle Animation */}
                <div className="w-full md:w-1/2 p-12 flex flex-col items-center justify-center space-y-8 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 border-b md:border-b-0 md:border-r border-white/5">
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-3xl opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className={cn(
                        "w-12 h-12 transition-all duration-1000",
                        isRevealing ? "text-purple-400 animate-pulse scale-125" : "text-gray-600"
                      )} />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-display">The Oracle</h3>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Choosing your next masterpiece</p>
                  </div>

                  <button
                    onClick={handleSurprise}
                    disabled={isRevealing}
                    className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <RotateCcw className={cn("w-4 h-4", isRevealing && "animate-spin")} />
                    Consult Again
                  </button>
                </div>

                {/* Right Side: Selection */}
                <div className="w-full md:w-1/2 p-12 bg-zinc-900/50 flex flex-col justify-center relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {isRevealing ? (
                      <motion.div
                        key="oracle-searching"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6 text-center"
                      >
                        <div className="flex justify-center gap-2">
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                              className="w-2 h-2 bg-purple-500 rounded-full"
                            />
                          ))}
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] animate-pulse">Scanning Watchlist...</p>
                      </motion.div>
                    ) : selectedEntry ? (
                      <motion.div
                        key={selectedEntry.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8 flex flex-col h-full justify-center"
                      >
                        <div className="flex gap-6 items-start">
                          <div className="w-32 h-48 rounded-2xl bg-zinc-800 overflow-hidden shrink-0 border border-white/10 shadow-2xl">
                            <Poster entry={selectedEntry} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-3">
                              <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                                <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest">Oracle's Choice</span>
                              </div>
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-[10px] font-black">{selectedEntry.imdbRating}</span>
                              </div>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] font-display line-clamp-2">
                              {selectedEntry.title}
                            </h2>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                              {selectedEntry.year} • {selectedEntry.genre} • {selectedEntry.runtime} min
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 font-medium border-l-2 border-purple-500/30 pl-4">
                            {selectedEntry.review || "This masterpiece awaits your discovery in your watchlist."}
                          </p>
                          
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() => {
                                const entry = selectedEntry;
                                setIsOpen(false);
                                setTimeout(() => onSelect(entry), 50);
                              }}
                              className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="oracle-idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-4"
                      >
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Ready to find your next favorite movie?</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
