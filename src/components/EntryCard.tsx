import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Star, 
  ExternalLink,
  MoreVertical,
  Info,
  Volume2,
  VolumeX,
  Plus,
  Loader2,
  Search,
  ImageIcon
} from 'lucide-react';
import { StarRating } from './StarRating';
import { Entry } from '../types';
import { cn } from '../lib/utils';
import { Poster } from './Poster';

export interface EntryCardProps {
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onUpdate?: (entry: Entry) => void;
  onSelect?: (entry: Entry) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

const NEON_COLORS = {
  'Movie': '#3b82f6', // blue-500
  'Web Series': '#a855f7', // purple-500
  'Sitcom': '#22c55e', // green-500
  'Anime': '#ec4899', // pink-500
  'Documentary': '#eab308', // yellow-500
  'Mini-Series': '#ef4444', // red-500
};

const NEON_GLOWS = {
  'Movie': 'neon-glow-blue',
  'Web Series': 'neon-glow-purple',
  'Sitcom': 'neon-glow-green',
  'Anime': 'neon-glow-pink',
  'Documentary': 'neon-glow-yellow',
  'Mini-Series': 'neon-glow-red',
};

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onEdit, onUpdate, onSelect, isSelected, onToggleSelect }) => {
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const neonColor = NEON_COLORS[entry.type as keyof typeof NEON_COLORS] || '#3b82f6';
  const neonGlow = NEON_GLOWS[entry.type as keyof typeof NEON_GLOWS] || 'neon-glow-blue';

  const isSeries = ['Web Series', 'Sitcom', 'Anime', 'Mini-Series'].includes(entry.type);
  const progress = isSeries && entry.totalEpisodes && entry.totalEpisodes > 0
    ? Math.round((entry.episodesWatched / entry.totalEpisodes) * 100) 
    : 0;

  const startHoverTimer = () => {
    setIsHovering(true);
    setIsLoadingPreview(true);
    hoverTimerRef.current = setTimeout(() => {
      setIsPreviewActive(true);
      setIsLoadingPreview(false);
    }, 500);
  };

  const clearHoverTimer = () => {
    setIsHovering(false);
    setIsPreviewActive(false);
    setIsLoadingPreview(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  const handleTouchStart = () => {
    touchTimerRef.current = setTimeout(() => {
      setIsPreviewActive(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
  };

  const getInitials = (title: string) => {
    return title
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const trailerSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(entry.title + ' ' + entry.year + ' official trailer')}`;
  const trailerEmbedUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(entry.title + ' ' + entry.year + ' official trailer')}&autoplay=1&mute=${isMuted ? 1 : 0}&modestbranding=1&rel=0`;

  return (
    <div 
      className="relative z-10"
      onMouseEnter={startHoverTimer}
      onMouseLeave={clearHoverTimer}
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -12, scale: 1.02 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "group relative bg-zinc-900 rounded-[2rem] overflow-hidden border transition-all duration-500",
          isSelected ? "border-neon-blue ring-2 ring-neon-blue/50" : "border-white/5 hover:border-white/20",
          neonGlow,
          isHovering && "z-50"
        )}
      >
        {/* Loading Spinner for 2s delay */}
        <AnimatePresence>
          {isLoadingPreview && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-md"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-12 h-12">
                  <Loader2 className="w-full h-full text-blue-500 animate-spin" />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    className="absolute inset-0 border-2 border-blue-500/20 rounded-full"
                  />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Loading Preview</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selection Checkbox */}
        {onToggleSelect && (
          <div className="absolute top-4 left-4 z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(entry.id);
              }}
              className={cn(
                "w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
                isSelected ? "bg-neon-blue border-neon-blue text-black" : "bg-black/40 border-white/20 text-transparent hover:border-white/40"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="aspect-[4/5] relative overflow-hidden bg-zinc-950">
          <Poster 
            entry={entry} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          
          {/* Cinematic Gradient Overlays */}
          
          {/* Cinematic Gradient Overlays */}
          <div className="absolute inset-0 poster-gradient" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
          
          {/* Type Badge (Neon) */}
          <div 
            className={cn(
              "absolute top-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl z-10",
              onToggleSelect ? "left-12" : "left-4"
            )}
            style={{ 
              backgroundColor: `${neonColor}20`, 
              border: `1px solid ${neonColor}`,
              boxShadow: `0 0 10px ${neonColor}40`
            }}
          >
            {entry.type}
          </div>

          {/* Platform Badges (Mocked for India) */}
          <div className="absolute top-14 left-4 flex flex-col gap-1.5 z-10">
            {['Netflix', 'Prime Video', 'Disney+'].slice(0, Math.floor(Math.random() * 3) + 1).map(p => (
              <div 
                key={p} 
                className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-widest"
                title={`Available on ${p}`}
              >
                {p}
              </div>
            ))}
          </div>

          {/* Rating Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-xl px-3 py-1 rounded-full border border-white/10">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-black text-white">{entry.imdbRating || '—'}</span>
          </div>

          {/* Info Overlay on Hover */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="space-y-4">
              {entry.status === 'Want to Watch' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate?.({ ...entry, status: 'Watching', startDate: new Date().toISOString() });
                  }}
                  className="w-full bg-blue-500 text-white h-12 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Start Watching
                </button>
              )}
              {entry.status === 'Watching' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate?.({ ...entry, status: 'Completed', watchedDate: new Date().toISOString() });
                  }}
                  className="w-full bg-green-500 text-white h-12 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Completed
                </button>
              )}
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(entry);
                  }}
                  className="flex-1 bg-white text-black h-12 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                >
                  {entry.status === 'Completed' ? 'Edit Review' : 'Edit Details'}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(entry);
                  }}
                  className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div 
          className="p-4 space-y-3 cursor-pointer"
          onClick={() => onSelect?.(entry)}
        >
          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-black text-white leading-tight line-clamp-1 group-hover:text-neon-blue transition-colors duration-300 font-display uppercase tracking-tight">
                {entry.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span>{entry.year}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span>{entry.genre}</span>
            </div>
          </div>

          {/* Progress Bar for Series (Watching) */}
          {isSeries && entry.totalEpisodes && entry.status === 'Watching' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span className="flex items-center gap-2">
                  <Play className="w-3 h-3 fill-current" />
                  Progress
                </span>
                <span style={{ color: neonColor }}>{entry.episodesWatched}/{entry.totalEpisodes} EP</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: neonColor,
                    boxShadow: `0 0 10px ${neonColor}80`
                  }}
                />
              </div>
            </div>
          )}

          {/* Rating and Review for Completed */}
          {entry.status === 'Completed' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-yellow-500">
                  <StarRating rating={entry.myRating} size={12} />
                  <span className="ml-2 text-[10px] font-black text-white">{entry.myRating}/5</span>
                </div>
                {entry.watchHistory && entry.watchHistory.length > 0 && (
                  <div className="flex items-center gap-1 text-neon-green">
                    <History className="w-3 h-3" />
                    <span className="text-[10px] font-black">{entry.watchHistory.length + 1}x</span>
                  </div>
                )}
              </div>
              {entry.review && (
                <p className="text-xs font-medium text-gray-400 italic line-clamp-2 leading-relaxed">
                  "{entry.review}"
                </p>
              )}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
              entry.status === 'Completed' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
              entry.status === 'Watching' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
              entry.status === 'Dropped' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
              "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
            )}>
              {entry.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> :
               entry.status === 'Watching' ? <Play className="w-3 h-3 fill-current" /> :
               <Clock className="w-3 h-3" />}
              {entry.status}
            </div>
            
            <a 
              href={`https://www.justwatch.com/in/search?q=${encodeURIComponent(entry.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-[10px] font-black text-neon-blue hover:text-white transition-colors uppercase tracking-widest"
            >
              <Search className="w-3 h-3" />
              Watch
            </a>
          </div>
        </div>
      </motion.div>

      {/* Hover Preview Popup */}
      <AnimatePresence>
        {isPreviewActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[105%] w-[340px] bg-zinc-900 rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[100]"
            style={{ borderBottom: `4px solid ${neonColor}` }}
          >
            {/* Trailer Preview Area (Reliable Fallback) */}
            <div className="aspect-video relative bg-black group/trailer overflow-hidden">
              <Poster 
                entry={entry} 
                className="w-full h-full object-cover opacity-40 blur-[2px] scale-110" 
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <motion.a 
                  href={trailerSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] group/play"
                >
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </motion.a>
                <div className="text-center">
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Watch Official Trailer</p>
                  <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1">Opens on YouTube</p>
                </div>
              </div>

              {/* Type Badge in Preview */}
              <div className="absolute top-4 left-4 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">
                {entry.type}
              </div>
            </div>

            {/* Preview Info */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-black text-white uppercase tracking-tight font-display truncate">{entry.title}</h4>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{entry.year} • {entry.genre}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg shrink-0 ml-4">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-[10px] font-black text-yellow-500">{entry.imdbRating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {entry.status === 'Want to Watch' ? (
                  <button 
                    onClick={() => onUpdate?.({ ...entry, status: 'Watching', startDate: new Date().toISOString() })}
                    className="col-span-2 bg-blue-500 text-white h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(59,130,246,0.3)]"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Start Watching
                  </button>
                ) : entry.status === 'Watching' ? (
                  <button 
                    onClick={() => onUpdate?.({ ...entry, status: 'Completed', watchedDate: new Date().toISOString() })}
                    className="col-span-2 bg-green-500 text-white h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(34,197,94,0.3)]"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Mark Completed
                  </button>
                ) : (
                  <div className="col-span-2 py-3 bg-white/5 border border-white/5 rounded-2xl text-center">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Already Watched</span>
                  </div>
                )}
                
                <button 
                  onClick={() => onEdit(entry)}
                  className="bg-white/5 border border-white/10 text-white h-10 rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  Edit Details
                </button>
                <button 
                  onClick={() => onSelect?.(entry)}
                  className="bg-white/5 border border-white/10 text-white h-10 rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  Full Info
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
