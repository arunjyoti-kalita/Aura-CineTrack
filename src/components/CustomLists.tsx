import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  List as ListIcon, 
  Trash2, 
  ChevronRight, 
  Film, 
  Search,
  X,
  Edit2,
  Bookmark,
  PlusCircle,
  Check
} from 'lucide-react';
import { Entry, CustomList } from '../types';
import { cn } from '../lib/utils';
import { Poster } from './Poster';
import { EntryCard } from './EntryCard';

interface CustomListsProps {
  entries: Entry[];
  lists: CustomList[];
  onAddList: (list: CustomList) => void;
  onDeleteList: (id: string) => void;
  onUpdateList: (list: CustomList) => void;
  onSelectEntry: (entry: Entry) => void;
  onUpdateEntry: (entry: Entry) => void;
  onEditEntry: (entry: Entry) => void;
  onToggleEntryInList: (listId: string, entryId: string) => void;
  onAddNew: (listId: string) => void;
}

const LIST_COLORS = [
  '#3b82f6', // blue
  '#a855f7', // purple
  '#22c55e', // green
  '#ec4899', // pink
  '#eab308', // yellow
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
];

export const CustomLists: React.FC<CustomListsProps> = ({ 
  entries, 
  lists, 
  onAddList, 
  onDeleteList, 
  onUpdateList,
  onSelectEntry,
  onUpdateEntry,
  onEditEntry,
  onToggleEntryInList,
  onAddNew
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isAddingMovies, setIsAddingMovies] = useState(false);
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [newList, setNewList] = useState({ name: '', description: '', color: LIST_COLORS[0] });

  const selectedList = useMemo(() => 
    lists.find(l => l.id === selectedListId) || null
  , [lists, selectedListId]);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newList.name.trim()) return;

    const list: CustomList = {
      id: editingListId || Math.random().toString(36).substr(2, 9),
      name: newList.name,
      description: newList.description,
      color: newList.color,
      entryIds: editingListId ? (selectedList?.entryIds || []) : [],
      createdAt: editingListId ? (selectedList?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    };

    if (editingListId) {
      onUpdateList(list);
    } else {
      onAddList(list);
    }
    
    setIsCreating(false);
    setEditingListId(null);
    setNewList({ name: '', description: '', color: LIST_COLORS[0] });
  };

  const handleEditList = (list: CustomList) => {
    setNewList({ name: list.name, description: list.description, color: list.color });
    setEditingListId(list.id);
    setIsCreating(true);
  };

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const listEntries = selectedList 
    ? entries.filter(e => selectedList.entryIds.includes(e.id))
    : [];

  const filteredEntriesForAdding = useMemo(() => {
    if (!movieSearchQuery.trim()) return entries.slice(0, 10);
    return entries.filter(e => 
      e.title.toLowerCase().includes(movieSearchQuery.toLowerCase()) ||
      e.director.toLowerCase().includes(movieSearchQuery.toLowerCase())
    ).slice(0, 10);
  }, [entries, movieSearchQuery]);

  const anyModalOpen = isCreating || selectedListId !== null || isAddingMovies;

  React.useEffect(() => {
    if (anyModalOpen) {
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
    }
  }, [anyModalOpen]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter font-display leading-none">Custom Lists</h2>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em]">Curate your cinematic collections</p>
        </div>
        <button
          onClick={() => {
            setEditingListId(null);
            setNewList({ name: '', description: '', color: LIST_COLORS[0] });
            setIsCreating(true);
          }}
          className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <Plus className="w-4 h-4" />
          Create New List
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lists.map((list) => (
          <motion.div
            key={list.id}
            layoutId={list.id}
            onClick={() => setSelectedListId(list.id)}
            className="group relative bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] cursor-pointer hover:bg-zinc-900/50 transition-all overflow-hidden"
          >
            <div 
              className="absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: list.color }}
            />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-start justify-between">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${list.color}20`, border: `1px solid ${list.color}` }}
                >
                  <ListIcon className="w-6 h-6" style={{ color: list.color }} />
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">{list.entryIds.length}</span>
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Entries</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display group-hover:text-neon-blue transition-colors">
                  {list.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed">
                  {list.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                  Created {new Date(list.createdAt).toLocaleDateString()}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </motion.div>
        ))}

        {lists.length === 0 && (
          <div className="col-span-full py-24 text-center space-y-6 bg-zinc-900/20 border border-dashed border-white/10 rounded-[3rem]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <Bookmark className="w-10 h-10 text-gray-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">No Lists Yet</h3>
              <p className="text-sm text-gray-500 font-medium">Start curating your favorite cinematic experiences.</p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
            >
              Create Your First List
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit List Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCreating(false);
                setEditingListId(null);
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-xl bg-zinc-900 rounded-[3rem] border border-white/10 p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <form onSubmit={handleCreateList} className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-display">
                      {editingListId ? 'Edit Collection' : 'New Collection'}
                    </h3>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Define your cinematic theme</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingListId(null);
                    }}
                    className="p-3 rounded-2xl bg-white/5 text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">List Name</label>
                    <input 
                      autoFocus
                      type="text"
                      value={newList.name}
                      onChange={e => setNewList(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Rainy Day Picks"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-blue/50 focus:bg-zinc-900 transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Description</label>
                    <textarea 
                      value={newList.description}
                      onChange={e => setNewList(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What's the vibe of this list?"
                      rows={3}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-neon-blue/50 focus:bg-zinc-900 transition-all resize-none font-bold"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Theme Color</label>
                    <div className="flex flex-wrap gap-3">
                      {LIST_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewList(prev => ({ ...prev, color }))}
                          className={cn(
                            "w-10 h-10 rounded-xl transition-all border-2",
                            newList.color === color ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                  {editingListId ? 'Update Collection' : 'Create Collection'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* List Detail View */}
      <AnimatePresence>
        {selectedList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] bg-black flex flex-col"
          >
            <header className="px-12 py-10 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setSelectedListId(null)}
                  className="p-4 rounded-2xl bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="space-y-1">
                  <div className="flex items-center gap-4">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter font-display">{selectedList.name}</h3>
                    <div 
                      className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      style={{ backgroundColor: selectedList.color }}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-500">{selectedList.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right mr-4">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Collection Size</p>
                  <p className="text-2xl font-black text-white">{listEntries.length} Titles</p>
                </div>
                
                <button
                  onClick={() => setIsAddingMovies(true)}
                  className="px-6 py-4 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Titles
                </button>

                <button
                  onClick={() => handleEditList(selectedList)}
                  className="p-4 rounded-2xl bg-white/5 text-gray-400 hover:text-white transition-all border border-white/5"
                >
                  <Edit2 className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setIsDeleting(selectedList.id)}
                  className="p-4 rounded-2xl bg-neon-red/10 text-neon-red hover:bg-neon-red hover:text-white transition-all border border-neon-red/20"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </header>

            {/* Delete Confirmation Overlay */}
            <AnimatePresence>
              {isDeleting && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                >
                  <div className="bg-zinc-900 border border-white/10 p-12 rounded-[3rem] max-w-md w-full text-center space-y-8">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                      <Trash2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-white uppercase tracking-tight">Delete List?</h4>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">This action cannot be undone.</p>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setIsDeleting(null)}
                        className="flex-1 py-4 bg-zinc-800 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          onDeleteList(isDeleting);
                          setIsDeleting(null);
                          setSelectedListId(null);
                        }}
                        className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              {listEntries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {listEntries.map(entry => (
                    <EntryCard 
                      key={entry.id} 
                      entry={entry} 
                      onEdit={onEditEntry}
                      onUpdate={onUpdateEntry}
                      onSelect={onSelectEntry}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40">
                  <Film className="w-24 h-24 text-gray-700" />
                  <div className="text-center space-y-2">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight">Empty Collection</h4>
                    <p className="text-sm font-medium text-gray-500">Add titles to this list from their detail view or use the button above.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Movies Modal */}
      <AnimatePresence>
        {isAddingMovies && selectedList && (
          <div className="fixed inset-0 z-[100100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingMovies(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-2xl bg-zinc-900 rounded-[3rem] border border-white/10 p-12 space-y-8 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-display">Add to {selectedList.name}</h3>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Search your library or log something new</p>
                </div>
                <button 
                  onClick={() => setIsAddingMovies(false)}
                  className="p-3 rounded-2xl bg-white/5 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="text"
                    value={movieSearchQuery}
                    onChange={e => setMovieSearchQuery(e.target.value)}
                    placeholder="Search by title or director..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>

                <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                  {filteredEntriesForAdding.map(entry => {
                    const isInList = selectedList.entryIds.includes(entry.id);
                    return (
                      <div 
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <Poster entry={entry} className="w-10 h-14 object-cover rounded-lg border border-white/10" />
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-tight">{entry.title}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{entry.year} • {entry.director}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onToggleEntryInList(selectedList.id, entry.id)}
                          className={cn(
                            "p-3 rounded-xl transition-all",
                            isInList 
                              ? "bg-blue-500 text-white shadow-lg" 
                              : "bg-white/5 text-gray-500 hover:text-white hover:bg-white/10"
                          )}
                        >
                          {isInList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </button>
                      </div>
                    );
                  })}
                  {filteredEntriesForAdding.length === 0 && (
                    <div className="py-12 text-center space-y-4">
                      <Film className="w-12 h-12 text-gray-700 mx-auto" />
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">No matching titles found.</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button
                    onClick={() => {
                      onAddNew(selectedList.id);
                      setIsAddingMovies(false);
                    }}
                    className="w-full py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                  >
                    <Plus className="w-4 h-4" />
                    Log New Movie to Library
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
