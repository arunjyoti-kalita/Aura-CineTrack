import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown,
  Play,
  Pause,
  Film,
  Ghost,
  Heart,
  Zap,
  Rocket,
  Frown
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Mood {
  id: string;
  name: string;
  icon: React.ElementType;
  url: string;
  color: string;
  genres: string[];
}

const MOODS: Mood[] = [
  { 
    id: 'cinematic', 
    name: 'Cinematic', 
    icon: Film, 
    url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_731e84a27f.mp3', // Epic Cinematic
    color: '#3b82f6',
    genres: ['All', 'Adventure', 'Music', 'Musical', 'Family']
  },
  { 
    id: 'thriller', 
    name: 'Thriller', 
    icon: Ghost, 
    url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_104e6e6a1f.mp3', // Suspenseful
    color: '#ef4444',
    genres: ['Horror', 'Thriller', 'Mystery', 'Crime']
  },
  { 
    id: 'romance', 
    name: 'Romance', 
    icon: Heart, 
    url: 'https://cdn.pixabay.com/audio/2023/11/13/audio_4a9a08e16f.mp3', // Romantic Piano
    color: '#ec4899',
    genres: ['Romance', 'Comedy']
  },
  { 
    id: 'action', 
    name: 'Action', 
    icon: Zap, 
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_824f5a817b.mp3', // Cyberpunk Action
    color: '#eab308',
    genres: ['Action', 'War', 'Sport', 'Western']
  },
  { 
    id: 'scifi', 
    name: 'Sci-Fi', 
    icon: Rocket, 
    url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_88c4a4087e.mp3', // Sci-Fi Ambient
    color: '#a855f7',
    genres: ['Sci-Fi', 'Fantasy', 'Animation']
  },
  { 
    id: 'drama', 
    name: 'Drama', 
    icon: Frown, 
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a7315b.mp3', // Emotional Drama
    color: '#6366f1',
    genres: ['Drama', 'History', 'Documentary', 'Biography']
  }
];

interface MoodMusicPlayerProps {
  preferences: { mood: string; volume: number };
  onUpdatePreferences: (newPrefs: any) => void;
  className?: string;
}

export function MoodMusicPlayer({ preferences, onUpdatePreferences, className }: MoodMusicPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentMood, setCurrentMood] = useState<Mood>(() => {
    return MOODS.find(m => m.id === preferences.mood) || MOODS[0];
  });
  const [volume, setVolume] = useState(preferences.volume);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const overrideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state with props
  useEffect(() => {
    const mood = MOODS.find(m => m.id === preferences.mood) || MOODS[0];
    if (mood.id !== currentMood.id) {
      setCurrentMood(mood);
    }
    if (preferences.volume !== volume) {
      setVolume(preferences.volume);
    }
  }, [preferences]);

  const playAudio = async () => {
    if (audioRef.current && isPlaying && !isError) {
      try {
        await audioRef.current.play();
      } catch (e) {
        console.error("Audio play failed:", e);
        // Don't cycle, just stop and show error
        setIsPlaying(false);
      }
    }
  };

  const handleAudioError = (e: any) => {
    console.error("Audio Error:", e);
    setIsError(true);
    setIsPlaying(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src = currentMood.url;
      setIsError(false);
      localStorage.removeItem('cinetrack_mood_failed_start');
      
      if (wasPlaying) {
        playAudio();
      }
    }
    onUpdatePreferences({ mood: currentMood.id });
  }, [currentMood]);

  useEffect(() => {
    onUpdatePreferences({ volume });
  }, [volume]);

  // Listen for genre changes from Dashboard
  useEffect(() => {
    const handleGenreChange = (e: any) => {
      // Ignore if user manually picked a mood recently
      if (isManualOverride) return;

      const genre = e.detail;
      const matchingMood = MOODS.find(mood => mood.genres.includes(genre));
      if (matchingMood && matchingMood.id !== currentMood.id) {
        setCurrentMood(matchingMood);
      }
    };

    window.addEventListener('cinetrack_genre_change', handleGenreChange);
    return () => window.removeEventListener('cinetrack_genre_change', handleGenreChange);
  }, [currentMood, isManualOverride]);

  const handleMoodClick = (mood: Mood) => {
    setCurrentMood(mood);
    setIsManualOverride(true);
    
    // Reset manual override after 30 seconds of inactivity
    if (overrideTimeoutRef.current) clearTimeout(overrideTimeoutRef.current);
    overrideTimeoutRef.current = setTimeout(() => {
      setIsManualOverride(false);
    }, 30000);
  };

  const togglePlay = () => {
    if (isError) return;
    setIsPlaying(!isPlaying);
  };
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className={cn("fixed bottom-8 left-8 z-[100]", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full left-0 mb-4 w-72 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: isError ? '#ef444420' : `${currentMood.color}20`, color: isError ? '#ef4444' : currentMood.color }}
                >
                  <currentMood.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">
                    {isError ? 'Music Unavailable' : currentMood.name}
                  </h4>
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                    {isError ? 'All sources failed' : 'Ambient Mood'}
                  </p>
                </div>
              </div>
              <button 
                onClick={togglePlay}
                disabled={isError}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg",
                  isError ? "bg-zinc-800 text-gray-600 cursor-not-allowed" : "bg-white text-black hover:scale-110"
                )}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodClick(mood)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all group",
                    currentMood.id === mood.id 
                      ? "bg-white/10 border-white/20" 
                      : "bg-zinc-800/50 border-transparent hover:border-white/10"
                  )}
                >
                  <mood.icon 
                    className="w-4 h-4 transition-transform group-hover:scale-110" 
                    style={{ color: currentMood.id === mood.id ? mood.color : '#71717a' }}
                  />
                  <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-white">
                    {mood.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-white/5">
              <button onClick={toggleMute} className="text-gray-500 hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="flex-1 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio 
        ref={audioRef}
        src={currentMood.url}
        loop
        crossOrigin="anonymous"
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={(e) => handleAudioError(e)}
        onStalled={() => setIsLoading(false)}
      />
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group relative",
          isOpen ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]" : "bg-zinc-900/80 text-gray-400 border border-white/10 hover:border-white/20"
        )}
      >
        <div className="relative">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Music className="w-6 h-6" />
          )}
          {isPlaying && !isLoading && (
            <div className="absolute -top-1 -right-1 flex gap-0.5 items-end h-3">
              <motion.div 
                animate={{ height: [4, 12, 6, 10, 4] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-0.5 bg-blue-500 rounded-full"
              />
              <motion.div 
                animate={{ height: [8, 4, 12, 6, 8] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="w-0.5 bg-blue-500 rounded-full"
              />
              <motion.div 
                animate={{ height: [6, 10, 4, 12, 6] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="w-0.5 bg-blue-500 rounded-full"
              />
            </div>
          )}
        </div>
        
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-black scale-0 group-hover:scale-100 transition-transform duration-300" />
      </button>
    </div>
  );
}
