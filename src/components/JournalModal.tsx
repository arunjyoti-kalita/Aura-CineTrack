import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageSquare, Quote, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { Entry } from '../types';
import { cn } from '../lib/utils';
import { Poster } from './Poster';

interface JournalModalProps {
  entry: Entry;
  onSave: (entry: Entry) => void;
  onClose: () => void;
}

const MOODS = [
  { emoji: '😂', label: 'Funny' },
  { emoji: '😱', label: 'Scary' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '🤯', label: 'Mind-blown' },
  { emoji: '🥰', label: 'Heartwarming' },
  { emoji: '⚡', label: 'Thrilling' },
];

export function JournalModal({ entry, onSave, onClose }: JournalModalProps) {
  const [notes, setNotes] = useState(entry.journalNotes || '');
  const [mood, setMood] = useState(entry.journalMood);
  const [recommend, setRecommend] = useState(entry.recommend ?? true);
  const [quote, setQuote] = useState(entry.memorableQuote || '');

  const handleSave = () => {
    onSave({
      ...entry,
      journalNotes: notes,
      journalMood: mood,
      recommend,
      memorableQuote: quote,
      status: 'Completed',
      watchedDate: entry.watchedDate || new Date().toISOString()
    });
  };

  React.useEffect(() => {
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
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative z-10 w-full max-w-2xl bg-zinc-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-16 rounded-lg overflow-hidden border border-white/10 shadow-lg">
              <Poster entry={entry} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">How was it?</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{entry.title} ({entry.year})</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Mood Rating */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              How did it make you feel?
            </label>
            <div className="flex justify-between gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.emoji}
                  onClick={() => setMood(m.emoji as any)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all group",
                    mood === m.emoji 
                      ? "bg-blue-500/20 border-blue-500 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]" 
                      : "bg-black/40 border-white/5 text-gray-500 hover:border-white/20"
                  )}
                >
                  <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{m.emoji}</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <MessageSquare className="w-3 h-3" />
              Your Thoughts
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your personal cinematic diary entry..."
              className="w-full h-40 bg-black/40 border border-white/5 rounded-3xl p-6 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none placeholder:text-gray-700"
            />
          </div>

          {/* Memorable Quote */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <Quote className="w-3 h-3" />
              Memorable Quote
            </label>
            <div className="relative">
              <Quote className="absolute left-4 top-4 w-4 h-4 text-gray-700" />
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="A dialogue that stayed with you..."
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700"
              />
            </div>
          </div>

          {/* Recommendation */}
          <div className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-[2rem]">
            <div className="space-y-1">
              <p className="text-xs font-black text-white uppercase tracking-widest">Would you recommend it?</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Help others discover great cinema</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRecommend(true)}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                  recommend === true ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "bg-zinc-800 text-gray-500 hover:text-white"
                )}
              >
                <ThumbsUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => setRecommend(false)}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                  recommend === false ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]" : "bg-zinc-800 text-gray-500 hover:text-white"
                )}
              >
                <ThumbsDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-black/20">
          <button
            onClick={handleSave}
            className="w-full bg-white text-black h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            Save to My Journal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
