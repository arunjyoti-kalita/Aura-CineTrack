import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Star, Film, Globe, Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Entry, CustomList } from '../types';
import { ExportButton } from './ExportButton';
import { cn } from '../lib/utils';

interface TasteEvolutionProps {
  entries: Entry[];
  username: string;
  customLists: CustomList[];
  onExportComplete: () => void;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#eab308', '#22c55e', '#06b6d4'];

export function TasteEvolution({ entries, username, customLists, onExportComplete }: TasteEvolutionProps) {
  const completedEntries = entries.filter(e => e.status === 'Completed' && e.watchedDate);

  const timelineData = useMemo(() => {
    const months: Record<string, { count: number, totalRating: number, genres: Record<string, number> }> = {};
    
    completedEntries.forEach(entry => {
      const date = new Date(entry.watchedDate!);
      const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      if (!months[key]) months[key] = { count: 0, totalRating: 0, genres: {} };
      
      months[key].count += 1;
      months[key].totalRating += entry.myRating;
      months[key].genres[entry.genre] = (months[key].genres[entry.genre] || 0) + 1;
    });

    return Object.entries(months).map(([name, data]) => ({
      name,
      count: data.count,
      avgRating: (data.totalRating / data.count).toFixed(1),
      topGenre: Object.entries(data.genres).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    }));
  }, [completedEntries]);

  const genreData = useMemo(() => {
    const genres: Record<string, number> = {};
    completedEntries.forEach(e => {
      genres[e.genre] = (genres[e.genre] || 0) + 1;
    });
    return Object.entries(genres)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [completedEntries]);

  const personality = useMemo(() => {
    const count = completedEntries.length;
    if (count < 5) return { title: "The Budding Cinephile", desc: "Just starting your cinematic journey." };
    if (count < 15) return { title: "The Genre Explorer", desc: "Diving deep into different worlds." };
    if (count < 30) return { title: "The Dedicated Critic", desc: "Refining your taste with every watch." };
    return { title: "The World Cinema Buff", desc: "A true master of the silver screen." };
  }, [completedEntries]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter font-display">Taste Evolution</h1>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] ml-16">
            Visualizing your cinematic growth over time
          </p>
        </div>
        
        <div className="md:w-64">
          <ExportButton 
            entries={entries} 
            username={username} 
            customLists={customLists}
            onExportComplete={onExportComplete}
          />
        </div>
      </header>

      {/* Personality Section */}
      <section className="relative p-12 bg-zinc-900/30 border border-white/5 rounded-[3rem] overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/10 transition-all" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-48 h-48 rounded-[3rem] bg-gradient-to-br from-purple-500 to-blue-500 p-1 shadow-2xl">
            <div className="w-full h-full rounded-[2.8rem] bg-zinc-900 flex items-center justify-center">
              <Sparkles className="w-20 h-20 text-white" />
            </div>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Your Cinema Personality</span>
            </div>
            <h2 className="text-6xl font-black text-white uppercase tracking-tight font-display leading-none">
              {personality.title}
            </h2>
            <p className="text-xl font-bold text-gray-500 uppercase tracking-widest max-w-xl">
              {personality.desc}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Rating Trend */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-12 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">Rating Trend</h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Average rating per month</p>
            </div>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#71717a" fontSize={10} fontWeight="bold" domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '1rem' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="avgRating" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRating)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-12 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">Genre DNA</h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Your most watched genres</p>
            </div>
            <Film className="w-6 h-6 text-blue-500" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4">
              {genreData.map((genre, index) => (
                <div key={genre.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{genre.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{genre.value} titles</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h3 className="text-3xl font-black text-white uppercase tracking-tight font-display">Cinematic Milestones</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "First Watch", date: completedEntries[0]?.watchedDate, icon: Film },
            { label: "First 10/10", date: completedEntries.find(e => e.myRating === 10)?.watchedDate, icon: Star },
            { label: "Global Explorer", date: completedEntries.find(e => e.country !== 'USA' && e.country !== 'India')?.watchedDate, icon: Globe },
          ].map((milestone, index) => (
            <div key={index} className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 space-y-4 group hover:bg-zinc-900/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <milestone.icon className="w-6 h-6 text-gray-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">{milestone.label}</h4>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                  {milestone.date ? new Date(milestone.date).toLocaleDateString() : 'Upcoming...'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
