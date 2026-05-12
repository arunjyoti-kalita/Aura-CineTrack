import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Clock, Globe, Film, Tv, Share2, X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Entry } from '../types';
import { cn } from '../lib/utils';

interface CinematicWrappedProps {
  entries: Entry[];
  onClose: () => void;
}

export function CinematicWrapped({ entries, onClose }: CinematicWrappedProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const completedEntries = entries.filter(e => e.status === 'Completed');
  const totalMinutes = completedEntries.reduce((acc, curr) => acc + curr.runtime, 0);
  const topGenre = Object.entries(
    completedEntries.reduce((acc, curr) => {
      acc[curr.genre] = (acc[curr.genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

  const topActor = Object.entries(
    completedEntries.reduce((acc, curr) => {
      acc[curr.leadActor] = (acc[curr.leadActor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

  const personalityType = totalMinutes > 5000 ? 'The Ultimate Cinephile' : totalMinutes > 2000 ? 'The Dedicated Watcher' : 'The Casual Explorer';

  const slides = [
    {
      title: "Your 2026 Cinematic Journey",
      content: (
        <div className="space-y-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="w-32 h-32 bg-blue-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)]"
          >
            <Film className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">Ready to see your year in film?</h2>
          <p className="text-xl font-bold text-gray-400 uppercase tracking-widest">Let's dive into your viewing habits.</p>
        </div>
      )
    },
    {
      title: "The Big Numbers",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          <div className="bg-zinc-900/50 p-12 rounded-[3rem] border border-white/10 space-y-4 text-center">
            <span className="text-7xl font-black text-blue-500 tracking-tighter">{completedEntries.length}</span>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Titles Completed</p>
          </div>
          <div className="bg-zinc-900/50 p-12 rounded-[3rem] border border-white/10 space-y-4 text-center">
            <span className="text-7xl font-black text-purple-500 tracking-tighter">{Math.round(totalMinutes / 60)}</span>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Hours Watched</p>
          </div>
        </div>
      )
    },
    {
      title: "Your Vibe",
      content: (
        <div className="space-y-12 text-center">
          <div className="space-y-4">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Your Top Genre</p>
            <h2 className="text-8xl font-black text-green-500 uppercase tracking-tighter leading-none">{topGenre}</h2>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Your Star of the Year</p>
            <h2 className="text-6xl font-black text-white uppercase tracking-tight">{topActor}</h2>
          </div>
        </div>
      )
    },
    {
      title: "Your Personality",
      content: (
        <div className="space-y-12 text-center">
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 blur-[80px] opacity-30"
            />
            <h2 className="relative text-7xl font-black text-white uppercase tracking-tighter leading-none z-10">{personalityType}</h2>
          </div>
          <p className="text-xl font-bold text-gray-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            {personalityType === 'The Ultimate Cinephile' ? "You live and breathe cinema. Your knowledge is vast and your taste is impeccable." : "You're a dedicated viewer who knows what they like and isn't afraid to explore."}
          </p>
        </div>
      )
    }
  ];

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.scrollBehavior = 'auto';
    return () => {
      const savedScrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.scrollBehavior = '';
      if (savedScrollY) {
        window.scrollTo(0, Math.abs(parseInt(savedScrollY, 10)) || 0);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100000] bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/5 blur-[150px] rounded-full animate-pulse" />
      </div>

      <div className="relative w-full max-w-4xl h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between py-8 px-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black">CT</div>
            <span className="text-sm font-black text-white uppercase tracking-widest">CineTrack Wrapped</span>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bars */}
        <div className="flex gap-2 px-4 mb-12 relative z-10">
          {slides.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: idx === currentSlide ? "100%" : idx < currentSlide ? "100%" : "0%" }}
                transition={{ duration: idx === currentSlide ? 5 : 0.3, ease: "linear" }}
                onAnimationComplete={() => {
                  if (idx === currentSlide && currentSlide < slides.length - 1) {
                    setCurrentSlide(prev => prev + 1);
                  }
                }}
                className="h-full bg-white"
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="w-full flex flex-col items-center justify-center"
            >
              {slides[currentSlide].content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between py-12 px-4 relative z-10">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all disabled:opacity-20"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
              className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all disabled:opacity-20"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {currentSlide === slides.length - 1 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-12 py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share Wrapped
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
