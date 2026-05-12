import React from 'react';
import { motion } from 'motion/react';
import { Bookmark, Sparkles, Trash2, X } from 'lucide-react';
import { Entry } from '../types';
import { EntryCard } from './EntryCard';

interface WatchlistProps {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
  onSelect: (entry: Entry) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkStatusUpdate: (ids: string[], status: Entry['status']) => void;
}

export function Watchlist({ entries, onEdit, onSelect, onBulkDelete, onBulkStatusUpdate }: WatchlistProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const watchlist = entries.filter(e => e.status === 'Want to Watch');

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-white/10 rounded-3xl p-4 shadow-2xl flex items-center gap-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 border-r border-white/10">
            <span className="text-neon-blue font-black text-xl">{selectedIds.length}</span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Selected</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onBulkStatusUpdate(selectedIds, 'Watching');
                setSelectedIds([]);
              }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-colors border border-white/5"
            >
              Start Watching
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete ${selectedIds.length} items?`)) {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                }
              }}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors border border-red-500/20"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            onClick={() => setSelectedIds([])}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black text-white tracking-tight">Watchlist</h2>
          <p className="text-gray-400">Things you're excited to watch next</p>
        </div>
        
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            {watchlist.length} Items Pending
          </span>
        </div>
      </div>

      {watchlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {watchlist.map(entry => (
            <EntryCard 
              key={entry.id} 
              entry={entry} 
              onEdit={onEdit} 
              onSelect={onSelect}
              isSelected={selectedIds.includes(entry.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="h-[500px] flex flex-col items-center justify-center bg-zinc-900/30 border border-dashed border-white/5 rounded-[3rem] space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center border border-white/5">
            <Bookmark className="w-8 h-8 text-gray-800" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">Your watchlist is empty</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Save things you're excited to watch later</p>
          </div>
        </div>
      )}
    </div>
  );
}
