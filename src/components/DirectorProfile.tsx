import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Film, Star, Calendar, Info, TrendingUp, Plus, CheckCircle, ExternalLink, Users } from 'lucide-react';
import { Entry } from '../types';
import { cn } from '../lib/utils';
import { Poster } from './Poster';

interface DirectorProfileProps {
  directorName: string;
  entries: Entry[];
  onClose: () => void;
  onAddEntry: (entry: Entry) => void;
  onSelectDirector?: (name: string) => void;
}

interface DirectorInfo {
  name: string;
  bio: string;
  photoUrl: string;
  notableFilms: string[];
  style: string[];
  similarDirectors: string[];
}

export function DirectorProfile({ directorName, entries, onClose, onAddEntry, onSelectDirector }: DirectorProfileProps) {
  const [info, setInfo] = useState<DirectorInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const directorEntries = entries.filter(e => e.director === directorName);
  const watchedCount = directorEntries.filter(e => e.status === 'Completed').length;
  const avgRating = directorEntries.filter(e => e.myRating > 0).length > 0
    ? (directorEntries.reduce((acc, curr) => acc + curr.myRating, 0) / directorEntries.filter(e => e.myRating > 0).length).toFixed(1)
    : 'N/A';

  useEffect(() => {
    // Mock fetching director info (would use Wikipedia API in a real app)
    const fetchDirectorInfo = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockInfo: DirectorInfo = {
        name: directorName,
        bio: `${directorName} is a critically acclaimed filmmaker known for their unique vision and contribution to world cinema. They have consistently pushed the boundaries of visual storytelling, creating immersive experiences that resonate with audiences across generations.`,
        photoUrl: `https://picsum.photos/seed/${directorName}/400/400`,
        notableFilms: ['The Masterpiece', 'Cinematic Journey', 'Visionary Tales'],
        style: ['Non-linear storytelling', 'Practical effects', 'Visual grandeur'],
        similarDirectors: ['Christopher Nolan', 'Denis Villeneuve', 'Martin Scorsese', 'Quentin Tarantino'].filter(d => d !== directorName)
      };
      
      setInfo(mockInfo);
      setLoading(false);
    };

    fetchDirectorInfo();
  }, [directorName]);

  const isFilmInEntries = (title: string) => {
    return entries.some(e => e.title.toLowerCase() === title.toLowerCase());
  };

  const handleAddFilm = (title: string) => {
    if (isFilmInEntries(title)) return;

    const newEntry: Entry = {
      id: crypto.randomUUID(),
      title,
      type: 'Movie',
      year: new Date().getFullYear(),
      director: directorName,
      genre: 'Unknown',
      leadActor: 'Unknown',
      leadActress: 'Unknown',
      supportingActor: 'Unknown',
      platform: 'Other',
      country: 'Unknown',
      language: 'Unknown',
      runtime: 0,
      episodesWatched: 0,
      imdbRating: 0,
      myRating: 0,
      status: 'Want to Watch',
      watchedDate: '',
      rewatchable: false,
      mood: 'Anytime',
      basedOn: 'Original',
      review: '',
      posterUrl: `https://picsum.photos/seed/${title}/400/600`,
      addedAt: new Date().toISOString(),
    };

    onAddEntry(newEntry);
  };

  const handleCompleteCollection = () => {
    if (!info) return;
    info.notableFilms.forEach(film => {
      if (!isFilmInEntries(film)) {
        handleAddFilm(film);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative z-10 w-full max-w-4xl bg-zinc-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
      >
        {loading ? (
          <div className="h-[600px] flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] animate-pulse">Entering Director's Universe...</p>
          </div>
        ) : info && (
          <div className="flex flex-col md:flex-row h-full max-h-[85vh] overflow-hidden">
            {/* Left Sidebar: Photo & Stats */}
            <div className="w-full md:w-80 bg-black/40 p-12 space-y-8 border-r border-white/5 overflow-y-auto custom-scrollbar">
              <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src={info.photoUrl} alt={info.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight font-display leading-none">{info.name}</h2>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Visionary Director</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-2xl font-black text-white">{watchedCount}</p>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Watched</p>
                  </div>
                  <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-2xl font-black text-white">{avgRating}</p>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Avg Rating</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Director's Style</h4>
                  <div className="flex flex-wrap gap-2">
                    {info.style.map(s => (
                      <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-12 space-y-12 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">Biography</h3>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-lg font-medium text-gray-400 leading-relaxed">
                {info.bio}
              </p>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Film className="w-5 h-5 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">Filmography in CineTrack</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {directorEntries.map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5 group hover:bg-black/60 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-16 rounded-lg overflow-hidden border border-white/10">
                          <Poster entry={entry} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white uppercase tracking-tight">{entry.title}</h4>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{entry.year} • {entry.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {entry.myRating > 0 && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-black text-yellow-500">{entry.myRating}</span>
                          </div>
                        )}
                        {entry.status === 'Completed' ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <TrendingUp className="w-6 h-6 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">Complete the Collection</h3>
                  <button 
                    onClick={handleCompleteCollection}
                    disabled={info.notableFilms.every(film => isFilmInEntries(film))}
                    className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add All to Watchlist <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {info.notableFilms.map(film => {
                    const exists = isFilmInEntries(film);
                    return (
                      <div key={film} className="p-6 bg-zinc-800/30 rounded-3xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <Film className="w-5 h-5 text-gray-500" />
                          </div>
                          <span className="text-sm font-bold text-white uppercase tracking-tight">{film}</span>
                        </div>
                        <button 
                          onClick={() => handleAddFilm(film)}
                          disabled={exists}
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            exists 
                              ? "bg-green-500/20 text-green-500 cursor-default" 
                              : "bg-blue-500 text-white hover:scale-110"
                          )}
                        >
                          {exists ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">Similar Directors</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {info.similarDirectors.map(director => (
                    <button 
                      key={director}
                      onClick={() => onSelectDirector?.(director)}
                      className="group relative aspect-square rounded-3xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all"
                    >
                      <img 
                        src={`https://picsum.photos/seed/${director}/200/200`} 
                        alt={director} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none truncate">{director}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
