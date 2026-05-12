import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Clock, 
  Heart, 
  MapPin, 
  Languages,
  Award,
  Share2,
  Users,
  TrendingUp,
  Film,
  Star,
  ChevronRight,
  Search
} from 'lucide-react';
import { Entry } from '../types';
import { cn } from '../lib/utils';

interface ProfileProps {
  entries: Entry[];
  onReset: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Profile({ entries, onReset, onExport, onImport }: ProfileProps) {
  const [compareUrl, setCompareUrl] = React.useState('');
  const completed = entries.filter(e => e.status === 'Completed');
  
  // Top Genre
  const genreCounts = entries.reduce((acc, curr) => {
    acc[curr.genre] = (acc[curr.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Top Director
  const directorCounts = entries.reduce((acc, curr) => {
    if (curr.director !== 'N/A') acc[curr.director] = (acc[curr.director] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topDirector = Object.entries(directorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Total Hours & Breakdown
  const movieHours = Math.round(entries.filter(e => e.type === 'Movie').reduce((acc, curr) => acc + curr.runtime, 0) / 60);
  const seriesHours = Math.round(entries.filter(e => e.type !== 'Movie').reduce((acc, curr) => acc + (curr.runtime * (curr.episodesWatched || 1)), 0) / 60);
  const totalHours = movieHours + seriesHours;

  // Top Actor
  const actorCounts = entries.reduce((acc, curr) => {
    if (curr.leadActor !== 'N/A') acc[curr.leadActor] = (acc[curr.leadActor] || 0) + 1;
    if (curr.leadActress !== 'N/A') acc[curr.leadActress] = (acc[curr.leadActress] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topActor = Object.entries(actorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // International taste
  const countries = new Set(entries.map(e => e.country)).size;
  const languages = new Set(entries.map(e => e.language)).size;

  const ratedEntries = entries.filter(e => e.myRating > 0);
  const avgRating = ratedEntries.length > 0 
    ? (ratedEntries.reduce((a, b) => a + b.myRating, 0) / ratedEntries.length).toFixed(1) 
    : '0.0';

  const handleDirectorClick = (name: string) => {
    if (name === 'N/A') return;
    window.dispatchEvent(new CustomEvent('cinetrack_director_click', { detail: name }));
  };

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-zinc-900 rounded-full mx-auto flex items-center justify-center border border-white/5 shadow-2xl">
            <span className="text-4xl font-black text-gray-700">AK</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight uppercase font-display">Your Cinema Profile</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Your journey is just beginning</p>
        </div>

        <div className="flex flex-col items-center justify-center py-32 space-y-8 bg-zinc-900/30 border border-white/5 rounded-[3rem] border-dashed">
          <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center border border-white/5">
            <Trophy className="w-8 h-8 text-gray-800" />
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">No masterpieces yet</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
              Your wrap-up will appear here once you've added content to your library.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20"
        >
          <span className="text-4xl font-black text-white">AK</span>
        </motion.div>
        <h2 className="text-4xl font-black text-white tracking-tight">Your Cinema Wrap-Up</h2>
        <p className="text-gray-400">A celebration of your journey through stories</p>
      </div>

      {/* Main Wrap-Up Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900 border border-white/10 rounded-[40px] p-12 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] -ml-32 -mb-32" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">The Genre You Loved</p>
              <h3 className="text-6xl font-black text-white">{topGenre}</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Your Screen Time</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-blue-400">{totalHours}</span>
                <span className="text-2xl font-bold text-gray-500">Hours</span>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Movies</p>
                  <p className="text-sm font-black text-white">{movieHours}h</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Series</p>
                  <p className="text-sm font-black text-white">{seriesHours}h</p>
                </div>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Countries</span>
                </div>
                <p className="text-2xl font-black text-white">{countries}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Languages className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Languages</span>
                </div>
                <p className="text-2xl font-black text-white">{languages}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <button 
                onClick={() => handleDirectorClick(topDirector)}
                className="w-full flex items-center gap-4 group text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Film className="text-blue-500 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Top Director</p>
                  <p className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">{topDirector}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                  <Trophy className="text-yellow-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Top Performer</p>
                  <p className="text-xl font-black text-white">{topActor}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <Award className="text-green-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Completed</p>
                  <p className="text-xl font-black text-white">{completed.length} Masterpieces</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                  <Star className="text-purple-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Avg Rating Given</p>
                  <p className="text-xl font-black text-white">
                    {avgRating} / 10
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl text-center">
              <p className="text-sm font-bold text-white/80 mb-2 italic">"Cinema is a matter of what's in the frame and what's out."</p>
              <p className="text-xs font-black text-white uppercase tracking-widest">— Martin Scorsese</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Share & Compare Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight font-display">Share Profile</h3>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
            Generate a beautiful card of your cinematic journey to share with the world.
          </p>
          <button className="w-full h-14 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
            Generate Share Card
          </button>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight font-display">Compare with Friend</h3>
          </div>
          <div className="relative">
            <input 
              type="text" 
              value={compareUrl}
              onChange={(e) => setCompareUrl(e.target.value)}
              placeholder="Paste friend's profile URL..."
              className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-6 pr-14 text-xs font-bold text-white focus:outline-none focus:border-purple-500/50 transition-all"
            />
            <button className="absolute right-2 top-2 w-10 h-10 bg-purple-500 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform">
              <Search className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest text-center">
            Paste a unique CineTrack URL to see your taste compatibility
          </p>
        </div>
      </div>

      {/* Share Section */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={onExport}
            className="px-8 py-4 rounded-2xl bg-zinc-800 text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform border border-white/10"
          >
            Export Backup
          </button>
          <label className="px-8 py-4 rounded-2xl bg-zinc-800 text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform border border-white/10 cursor-pointer">
            Import Backup
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
          </label>
        </div>
        
        <button 
          onClick={onReset}
          className="text-xs font-bold text-red-500/60 hover:text-red-500 uppercase tracking-[0.2em] transition-colors"
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
}
