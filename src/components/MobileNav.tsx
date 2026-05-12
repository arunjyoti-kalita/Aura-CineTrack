import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, History, BarChart3, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onAddClick: () => void;
}

export function MobileNav({ activeTab, onTabChange, onAddClick }: MobileNavProps) {
  const tabs = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Home' },
    { id: 'timeline', icon: History, label: 'Timeline' },
    { id: 'stats', icon: BarChart3, label: 'Stats' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] p-6 pb-10 bg-gradient-to-t from-black via-black to-transparent pointer-events-none">
      <div className="max-w-md mx-auto flex items-center justify-between bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 shadow-2xl pointer-events-auto">
        {tabs.slice(0, 2).map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 flex-1 py-3 transition-all relative",
              activeTab === tab.id ? "text-blue-500" : "text-gray-500"
            )}
          >
            <tab.icon className={cn("w-6 h-6", activeTab === tab.id && "fill-current/10")} />
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabMobile"
                className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full"
              />
            )}
          </button>
        ))}

        {/* Center Add Button */}
        <button
          onClick={onAddClick}
          className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] -translate-y-4 hover:scale-110 active:scale-90 transition-all border-4 border-black"
        >
          <Plus className="w-8 h-8" />
        </button>

        <button
          onClick={() => onTabChange('stats')}
          className={cn(
            "flex flex-col items-center gap-1 flex-1 py-3 transition-all relative",
            activeTab === 'stats' ? "text-blue-500" : "text-gray-500"
          )}
        >
          <BarChart3 className={cn("w-6 h-6", activeTab === 'stats' && "fill-current/10")} />
          <span className="text-[8px] font-black uppercase tracking-widest">Stats</span>
          {activeTab === 'stats' && (
            <motion.div 
              layoutId="activeTabMobile"
              className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full"
            />
          )}
        </button>
        
        {/* Placeholder for settings or profile */}
        <div className="flex-1" />
      </div>
    </div>
  );
}
