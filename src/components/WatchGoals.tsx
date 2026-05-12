import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Plus, X, CheckCircle, Clock, ChevronRight, Sparkles, TrendingUp, Trash2, Edit2, PlusCircle } from 'lucide-react';
import { Goal, Entry } from '../types';
import { GENRES, POPULAR_COUNTRIES, normalizeCountryName } from '../constants';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

interface WatchGoalsProps {
  entries: Entry[];
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

export function WatchGoals({ entries, goals, onAddGoal, onDeleteGoal }: WatchGoalsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    type: 'Movies',
    target: 4,
    period: 'Monthly',
    manualOffset: 0
  });

  const activeGoals = useMemo(() => {
    return goals.filter(g => !g.completedAt).map(goal => {
      let current = 0;
      const now = new Date();
      const startOfPeriod = new Date();
      if (goal.period === 'Weekly') {
        startOfPeriod.setDate(now.getDate() - now.getDay());
      } else {
        startOfPeriod.setDate(1);
      }
      startOfPeriod.setHours(0, 0, 0, 0);

      const periodEntries = entries.filter(e => e.status === 'Completed' && new Date(e.watchedDate || 0) >= startOfPeriod);

      switch(goal.type) {
        case 'Movies':
          current = periodEntries.filter(e => {
            const isMovie = e.type === 'Movie';
            const matchesGenre = !goal.genre || e.genre === goal.genre;
            const matchesCountry = !goal.country || normalizeCountryName(e.country) === normalizeCountryName(goal.country);
            return isMovie && matchesGenre && matchesCountry;
          }).length;
          break;
        case 'Series':
          current = periodEntries.filter(e => {
            const isSeries = e.type === 'Web Series' || e.type === 'Mini-Series' || e.type === 'Sitcom';
            const matchesGenre = !goal.genre || e.genre === goal.genre;
            const matchesCountry = !goal.country || normalizeCountryName(e.country) === normalizeCountryName(goal.country);
            return isSeries && matchesGenre && matchesCountry;
          }).length;
          break;
        case 'Genres':
          current = new Set(periodEntries.map(e => e.genre)).size;
          break;
        case 'Country':
          current = new Set(periodEntries.map(e => normalizeCountryName(e.country))).size;
          break;
      }

      return { ...goal, current: current + (goal.manualOffset || 0) };
    });
  }, [goals, entries]);

  const completedGoals = goals.filter(g => g.completedAt);

  const handleAddGoal = () => {
    const goal: Goal = {
      id: editingGoalId || Math.random().toString(36).substr(2, 9),
      type: newGoal.type as any,
      target: newGoal.target || 1,
      current: 0,
      manualOffset: newGoal.manualOffset || 0,
      period: newGoal.period as any,
      notes: newGoal.notes,
      createdAt: new Date().toISOString(),
      genre: newGoal.genre,
      country: newGoal.country
    };
    onAddGoal(goal);
    setIsFormOpen(false);
    setEditingGoalId(null);
    setNewGoal({ type: 'Movies', target: 4, period: 'Monthly', manualOffset: 0 });
  };

  const handleEditGoal = (goal: Goal) => {
    setNewGoal(goal);
    setEditingGoalId(goal.id);
    setIsFormOpen(true);
  };

  const handleIncrementManual = (goal: Goal) => {
    onAddGoal({
      ...goal,
      manualOffset: (goal.manualOffset || 0) + 1
    });
  };

  const checkCompletion = (goal: Goal) => {
    if (goal.current >= goal.target && !goal.completedAt) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#ffffff']
      });
      onAddGoal({ ...goal, completedAt: new Date().toISOString() });
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-display">Watch Goals</h2>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] ml-16">Set targets and conquer your watchlist</p>
        </div>
        <button
          onClick={() => {
            setEditingGoalId(null);
            setNewGoal({ type: 'Movies', target: 4, period: 'Monthly', manualOffset: 0 });
            setIsFormOpen(true);
          }}
          className="h-14 px-8 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Set New Goal
        </button>
      </header>

      {/* Active Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {activeGoals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const isCompleted = goal.current >= goal.target;

            return (
              <motion.div
                layout
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 space-y-6 hover:bg-zinc-900/50 transition-all overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-all" />

                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{goal.period} Goal</span>
                      {isCompleted && <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />}
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">
                      {goal.type === 'Movies' && `Watch ${goal.target} ${goal.genre || ''} Movies ${goal.country ? `from ${goal.country}` : ''}`}
                      {goal.type === 'Series' && `Finish ${goal.target} ${goal.genre || ''} Series ${goal.country ? `from ${goal.country}` : ''}`}
                      {goal.type === 'Genres' && `Explore ${goal.target} Genres`}
                      {goal.type === 'Country' && `Watch from ${goal.target} Countries`}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditGoal(goal)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDeleteGoal(goal.id)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white">{goal.current}</span>
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">/ {goal.target}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-black text-blue-500 uppercase tracking-widest">{Math.round(progress)}%</span>
                      <button 
                        onClick={() => handleIncrementManual(goal)}
                        className="flex items-center gap-1 text-[8px] font-black text-gray-500 uppercase tracking-widest hover:text-blue-500 transition-colors"
                      >
                        <PlusCircle className="w-3 h-3" />
                        Manual +1
                      </button>
                    </div>
                  </div>
                  
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        isCompleted ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      )}
                    />
                  </div>
                </div>

                {isCompleted && (
                  <button
                    onClick={() => checkCompletion(goal)}
                    className="w-full py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Claim Achievement
                  </button>
                )}

                {goal.notes && (
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed pt-4 border-t border-white/5">
                    Note: {goal.notes}
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activeGoals.length === 0 && (
          <div className="col-span-full py-24 text-center space-y-6 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
              <Target className="w-10 h-10 text-gray-600" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-white uppercase tracking-tight">No active goals</h4>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Set a goal to push your cinematic boundaries!</p>
            </div>
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <section className="space-y-8 pt-12 border-t border-white/5">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">Achieved Goals</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="bg-zinc-900/50 border border-green-500/20 rounded-3xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Completed</p>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">
                    {goal.type} Goal: {goal.target}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Goal Creation Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-zinc-900 rounded-[3rem] border border-white/10 p-12 space-y-8 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight font-display">
                  {editingGoalId ? 'Edit Goal' : 'New Goal'}
                </h2>
                <button onClick={() => setIsFormOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Goal Type</label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as any })}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                  >
                    <option value="Movies">Watch Movies</option>
                    <option value="Series">Finish Series</option>
                    <option value="Genres">Explore Genres</option>
                    <option value="Country">Watch from Countries</option>
                  </select>
                </div>

                {(newGoal.type === 'Movies' || newGoal.type === 'Series') && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Genre Filter (Optional)</label>
                      <select
                        value={newGoal.genre || ''}
                        onChange={(e) => setNewGoal({ ...newGoal, genre: e.target.value || undefined })}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                      >
                        <option value="">All Genres</option>
                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Country Filter (Optional)</label>
                      <select
                        value={newGoal.country || ''}
                        onChange={(e) => setNewGoal({ ...newGoal, country: e.target.value || undefined })}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                      >
                        <option value="">All Countries</option>
                        {POPULAR_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Count</label>
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Period</label>
                    <select
                      value={newGoal.period}
                      onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value as any })}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Notes (Optional)</label>
                  <input
                    type="text"
                    value={newGoal.notes}
                    onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })}
                    placeholder="e.g. Focus on Korean cinema"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleAddGoal}
                className="w-full bg-blue-500 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                {editingGoalId ? 'Update Goal' : 'Create Goal'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
