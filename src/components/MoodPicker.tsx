import React from 'react';
import { motion } from 'motion/react';
import { MOOD_MAPPINGS } from '../constants';
import { cn } from '../lib/utils';

interface MoodPickerProps {
  onMoodSelect: (genres: string[]) => void;
  activeMood: string | null;
}

export function MoodPicker({ onMoodSelect, activeMood }: MoodPickerProps) {
  return (
    <section className="bg-zinc-900/30 border border-white/5 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 space-y-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-display">What's your mood tonight?</h3>
          <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Pick a vibe, we'll find the perfect watch</p>
        </div>
        {activeMood && (
          <button 
            onClick={() => onMoodSelect([])}
            className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {MOOD_MAPPINGS.map((mood) => (
          <motion.button
            key={mood.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMoodSelect(mood.genres)}
            className={cn(
              "flex flex-col items-center justify-center gap-4 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border transition-all duration-500 group relative overflow-hidden",
              activeMood === mood.label 
                ? "bg-blue-500/20 border-blue-500 text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]" 
                : "bg-black/40 border-white/5 text-gray-500 hover:border-white/20 hover:bg-zinc-900/50"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{mood.emoji}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
