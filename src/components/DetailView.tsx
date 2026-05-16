import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Star, 
  Calendar, 
  Clock, 
  User, 
  Clapperboard, 
  Tv, 
  Award, 
  Heart,
  Share2,
  Edit3,
  Bookmark,
  History as HistoryIcon,
  Tag,
  Search,
  Plus,
  Check
} from 'lucide-react';
import { Entry, CustomList } from '../types';
import { StarRating } from './StarRating';
import { TYPE_COLORS, NEON_GLOWS } from '../constants';
import { cn } from '../lib/utils';
import { Poster } from './Poster';

interface DetailViewProps {
  entry: Entry;
  lists: CustomList[];
  onClose: () => void;
  onEdit: () => void;
  onUpdateReview?: (id: string, review: string) => void;
  onToggleList: (listId: string, entryId: string) => void;
}

export function DetailView({ entry, lists, onClose, onEdit, onUpdateReview, onToggleList }: DetailViewProps) {
  const neonColor = TYPE_COLORS[entry.type as keyof typeof TYPE_COLORS] || 'var(--color-neon-blue)';
  const neonGlow = NEON_GLOWS[entry.type as keyof typeof NEON_GLOWS] || 'neon-glow-blue';

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-8"
    >
      <div 
        className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="relative w-full max-w-6xl bg-zinc-900/50 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]"
      >
        {/* Background Blur Poster */}
        <div className="absolute inset-0 opacity-20 blur-[100px] pointer-events-none">
          <Poster entry={entry} className="w-full h-full object-cover" />
        </div>

        {/* Poster Section */}
        <div className="w-full md:w-[400px] shrink-0 relative group">
          <Poster 
            entry={entry}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center gap-4">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                <StarRating rating={entry.myRating} size={16} />
                <span className="text-xl font-black text-white ml-2">{entry.myRating}/5</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={onEdit}
                  className="p-4 bg-white text-black rounded-2xl hover:scale-110 transition-transform shadow-xl"
                  title="Edit Entry"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
            </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto relative custom-scrollbar">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-white/10 text-gray-400 transition-all hover:rotate-90 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border",
                  `border-${entry.type.toLowerCase().replace(' ', '-')}`
                )} style={{ color: neonColor, borderColor: `${neonColor}40` }}>
                  {entry.type}
                </span>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> {entry.year}
                </span>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Clock className="w-3 h-3" /> {entry.runtime} MIN
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase font-display leading-none">
                {entry.title}
              </h2>
              <p className="text-lg font-bold text-gray-400 italic">Directed by {entry.director}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Genre</p>
                <p className="text-sm font-bold text-white">{entry.genre}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Platform</p>
                <p className="text-sm font-bold text-white">{entry.platform}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</p>
                <p className="text-sm font-bold text-neon-blue">{entry.status}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Cast</p>
              <div className="flex flex-wrap gap-3">
                {[entry.leadActor, entry.leadActress, entry.supportingActor].filter(a => a !== 'N/A').map((actor, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-xs font-bold text-white">{actor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Add to Custom Lists</p>
              <div className="flex flex-wrap gap-3">
                {lists.map(list => {
                  const isInList = list.entryIds.includes(entry.id);
                  return (
                    <button
                      key={list.id}
                      onClick={() => onToggleList(list.id, entry.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                        isInList 
                          ? "bg-white text-black border-white" 
                          : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20"
                      )}
                    >
                      {isInList ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      {list.name}
                    </button>
                  );
                })}
                {lists.length === 0 && (
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest italic">No custom lists created yet</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Where to Watch (India)</p>
              <div className="flex flex-wrap gap-4">
                {['Netflix', 'Prime Video', 'Disney+ Hotstar', 'Apple TV+', 'ZEE5', 'JioCinema'].map(platform => (
                  <div key={platform} className="flex items-center gap-2 bg-zinc-900/50 px-4 py-3 rounded-2xl border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
                    <span className="text-xs font-bold text-white">{platform}</span>
                  </div>
                ))}
              </div>
              <a 
                href={`https://www.justwatch.com/in/search?q=${encodeURIComponent(entry.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neon-blue/10 text-neon-blue border border-neon-blue/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue hover:text-white transition-all"
              >
                <Search className="w-4 h-4" />
                Find on JustWatch
              </a>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Tags & Keywords</p>
              <div className="flex flex-wrap gap-2">
                {entry.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    #{tag}
                  </span>
                ))}
                {(!entry.tags || entry.tags.length === 0) && (
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest italic">No tags added</p>
                )}
              </div>
            </div>

            {entry.watchHistory && entry.watchHistory.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Watch History (Rewatches)</p>
                <div className="space-y-2">
                  {entry.watchHistory.map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <HistoryIcon className="w-4 h-4 text-neon-green" />
                        <span className="text-xs font-bold text-white">{new Date(session.date).toLocaleDateString()}</span>
                      </div>
                      <StarRating rating={session.rating} size={12} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entry.awardsWon && (
              <div className="flex items-center gap-4 bg-neon-yellow/10 border border-neon-yellow/20 p-6 rounded-3xl">
                <Award className="w-8 h-8 text-neon-yellow" />
                <div>
                  <p className="text-[10px] font-black text-neon-yellow uppercase tracking-[0.2em]">Awards & Recognition</p>
                  <p className="text-sm font-bold text-white">{entry.awardsWon}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
