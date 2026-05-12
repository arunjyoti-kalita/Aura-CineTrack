import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flame, Calendar, CheckCircle2, Circle, Play, Settings2, RotateCcw, X } from 'lucide-react';
import { Entry } from '../types';
import { format, addDays, isSameDay, startOfDay, isAfter, isBefore, differenceInDays } from 'date-fns';
import { cn } from '../lib/utils';

interface ChallengeTrackerProps {
  entries: Entry[];
  startDate: string | null;
  onStart: () => void;
  onReset: () => void;
}

export function ChallengeTracker({ entries, startDate, onStart, onReset }: ChallengeTrackerProps) {
  const [showSettings, setShowSettings] = useState(false);

  const handleStart = () => {
    onStart();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your 30-day challenge? All progress will be lost.')) {
      onReset();
      setShowSettings(false);
    }
  };

  if (!startDate) {
    return (
      <section className="bg-zinc-900/30 border border-white/5 rounded-[4rem] p-12 md:p-24 overflow-hidden relative group min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-10 max-w-2xl"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <Trophy className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">The Ultimate Test</span>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] font-display">
              Can you watch<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">30 Movies</span><br />
              in 30 Days?
            </h3>
            <p className="text-lg font-bold text-gray-500 uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
              Push your cinematic limits, broaden your horizons, and earn the legendary Cinephile badge. One movie every day, for 30 days straight.
            </p>
          </div>

          <button 
            onClick={handleStart}
            className="group relative inline-flex items-center gap-4 px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(37,99,235,0.3)]"
          >
            <Play className="w-5 h-5 fill-current" />
            🎬 Start My Challenge
            <div className="absolute inset-0 rounded-[2rem] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>
      </section>
    );
  }

  const start = startOfDay(new Date(startDate));
  const end = addDays(start, 29);
  const today = startOfDay(new Date());
  
  const challengeDays = Array.from({ length: 30 }, (_, i) => addDays(start, i));
  
  const completedDates = entries
    .filter(e => e.status === 'Completed' && e.watchedDate)
    .map(e => startOfDay(new Date(e.watchedDate!)).getTime());

  // Check if watched something on a specific day
  const hasWatchedOnDay = (day: Date) => completedDates.includes(day.getTime());

  const watchedCount = challengeDays.filter(day => hasWatchedOnDay(day)).length;
  const progress = (watchedCount / 30) * 100;

  // Calculate streak within the challenge period
  const currentStreak = [...challengeDays]
    .filter(day => !isAfter(day, today))
    .reverse()
    .reduce((acc, day, idx) => {
      if (idx === 0 && !hasWatchedOnDay(day)) return 0;
      if (acc === idx && hasWatchedOnDay(day)) return acc + 1;
      return acc;
    }, 0);

  return (
    <section className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-8 md:p-12 space-y-12 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors duration-1000" />
      
      {/* Settings Icon */}
      <div className="absolute top-8 right-8 z-20">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-gray-500 hover:text-white"
        >
          <Settings2 className="w-5 h-5" />
        </button>
        
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-full right-0 mt-4 w-48 bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden"
            >
              <button
                onClick={handleReset}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors rounded-xl"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Challenge
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        <div className="space-y-6 max-w-md text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <Flame className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Challenge in Progress</span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-5xl font-black text-white uppercase tracking-tight font-display leading-[0.9]">Day {differenceInDays(today, start) + 1} of 30</h3>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span>Started: {format(start, 'MMM dd, yyyy')}</span>
              <span className="text-white/10">•</span>
              <span>Ends: {format(end, 'MMM dd, yyyy')}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-orange-500">
                <Flame className="w-5 h-5 fill-current" />
                <span className="text-3xl font-black">{currentStreak}</span>
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current Streak</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-3xl font-black">{watchedCount}</span>
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Movies Watched</p>
            </div>
          </div>
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              className="stroke-zinc-800 fill-none"
              strokeWidth="12"
            />
            <motion.circle
              initial={{ strokeDasharray: "0 1000" }}
              animate={{ strokeDasharray: `${(progress / 100) * 690} 1000` }}
              transition={{ duration: 2, ease: "easeOut" }}
              cx="128"
              cy="128"
              r="110"
              className="stroke-blue-500 fill-none"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white">{Math.round(progress)}%</span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Completed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3 relative z-10">
        {challengeDays.map((day, idx) => {
          const isToday = isSameDay(day, today);
          const isPast = isBefore(day, today);
          const isFuture = isAfter(day, today);
          const isCompleted = hasWatchedOnDay(day);

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              className={cn(
                "aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-500 border relative",
                isCompleted 
                  ? "bg-green-500 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] text-white" 
                  : isPast
                    ? "bg-zinc-800/50 border-white/5 text-gray-700"
                    : "bg-black/40 border-white/5 text-gray-700",
                isToday && "border-blue-500 ring-2 ring-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)]",
                isFuture && "opacity-40"
              )}
            >
              <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Day {idx + 1}</span>
              <span className="text-lg font-black leading-none">{format(day, 'dd')}</span>
              {isCompleted ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : isToday ? (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              ) : (
                <Circle className="w-3 h-3 opacity-20" />
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-bold text-blue-100 italic leading-relaxed">
          {isAfter(today, end) 
            ? "Challenge complete! Check your trophies to see if you earned the Cinephile badge."
            : currentStreak > 0 
              ? `You're on a ${currentStreak} day streak! Keep the cinematic momentum going.` 
              : 'Keep watching! Every movie brings you closer to the Cinephile title.'}
        </p>
      </div>
    </section>
  );
}
