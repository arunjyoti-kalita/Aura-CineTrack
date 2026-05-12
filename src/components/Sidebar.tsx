import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  Bookmark, 
  User, 
  Film,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Entry } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  entries: Entry[];
}

export function Sidebar({ activeTab, setActiveTab, entries }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'add', label: 'ADD ENTRY', icon: PlusCircle },
    { id: 'stats', label: 'INSIGHTS', icon: BarChart3 },
    { id: 'watchlist', label: 'WATCHLIST', icon: Bookmark },
    { id: 'profile', label: 'WRAP-UP', icon: User },
  ];

  const streak = React.useMemo(() => {
    const completedDates = entries
      .filter(e => e.status === 'Completed' && e.watchedDate)
      .map(e => new Date(e.watchedDate!).toDateString());
    
    if (completedDates.length === 0) return 0;
    
    const uniqueDates = Array.from(new Set(completedDates))
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const mostRecent = uniqueDates[0];
    const diffDays = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) return 0;
    
    let currentStreak = 1;
    let lastDate = mostRecent;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const date = uniqueDates[i];
      const diff = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        currentStreak++;
        lastDate = date;
      } else {
        break;
      }
    }
    
    return currentStreak;
  }, [entries]);

  return (
    <div className="w-72 bg-black/60 backdrop-blur-3xl border-r border-white/5 h-screen sticky top-0 flex flex-col p-8 z-40">
      <div className="flex items-center gap-4 mb-16">
        <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)]">
          <Film className="text-white w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic font-display">Aura <span className="text-blue-500">Track</span></h1>
      </div>

      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
              activeTab === item.id 
                ? "bg-white/10 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10" 
                : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute left-0 w-1.5 h-6 bg-neon-blue rounded-r-full shadow-[0_0_15px_rgba(0,242,255,0.8)]"
              />
            )}
            <item.icon className={cn(
              "w-5 h-5 transition-all duration-500 group-hover:scale-110",
              activeTab === item.id ? "text-neon-blue drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]" : "text-gray-600"
            )} />
            <span className="font-black text-[10px] tracking-[0.3em] uppercase">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/10 blur-3xl -mr-12 -mt-12 group-hover:bg-neon-purple/20 transition-colors" />
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Current Streak</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white">{streak}</p>
            <p className="text-xs font-bold text-neon-purple uppercase tracking-widest">Days 🔥</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 px-4">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10" />
          <div className="flex-1">
            <p className="text-[10px] font-black text-white truncate uppercase tracking-widest">Arun Kalita</p>
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Premium Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}
