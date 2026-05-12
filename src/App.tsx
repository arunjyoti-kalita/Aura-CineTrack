import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Entry, Goal, CustomList } from './types';
import { Trophy, Film, Calendar, Sparkles, User, LogOut, LayoutDashboard, Bookmark, Plus, Book, Target, Globe, TrendingUp, List, Database, Image as ImageIcon } from 'lucide-react';
import { cn } from './lib/utils';
import { QuickLog } from './components/QuickLog';
import { CinematicWrapped } from './components/CinematicWrapped';
import { TrophyShelf } from './components/TrophyShelf';
import { ChallengeTracker } from './components/ChallengeTracker';
import { motion, AnimatePresence } from 'motion/react';
import { DetailView } from './components/DetailView';
import { EntryForm } from './components/EntryForm';
import { MoodMusicPlayer } from './components/MoodMusicPlayer';
import { ExportButton } from './components/ExportButton';
import { MobileNav } from './components/MobileNav';
import { CheckCircle2 } from 'lucide-react';
import { JournalModal } from './components/JournalModal';
import { MyJournal } from './components/MyJournal';
import { DailyPick } from './components/DailyPick';
import { WatchGoals } from './components/WatchGoals';
import { WorldCinemaMap } from './components/WorldCinemaMap';
import { TasteEvolution } from './components/TasteEvolution';
import { DirectorProfile } from './components/DirectorProfile';
import { WeeklyChallenge } from './components/WeeklyChallenge';
import { CustomLists } from './components/CustomLists';
import { AuthScreen } from './components/AuthScreen';
import { ImportCSVButton } from './components/ImportCSVButton';
import { SAMPLE_DATA } from './sampleData';
import { 
  saveUserData, 
  loadUserData, 
  setUserSession, 
  getUserSession, 
  clearUserSession 
} from './lib/userStorage';
import { saveUserDataToCloud, loadUserDataFromCloud, syncAllDataToCloud, UserData } from './lib/firestoreService';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ErrorBoundary } from './components/ErrorBoundary';

type Tab = 'dashboard' | 'watchlist' | 'journal' | 'goals' | 'map' | 'evolution' | 'arena' | 'challenge' | 'profile' | 'lists';

export default function App() {
  const [userId, setUserId] = useState<string | null>(getUserSession());
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // Persistent States
  const [entries, setEntries] = useState<Entry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [customLists, setCustomLists] = useState<CustomList[]>([]);
  const [challengeStart, setChallengeStart] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({ mood: 'cinematic', volume: 0.5 });
  const [dailyPick, setDailyPick] = useState<{ id: string; date: string } | null>(null);
  
  const [showWrapped, setShowWrapped] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [journalEntry, setJournalEntry] = useState<Entry | null>(null);
  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);
  const [pendingListId, setPendingListId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Initialize Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserSession(user.uid);
      } else {
        // Check for legacy session if no Firebase user
        const legacySession = getUserSession();
        if (legacySession) setUserId(legacySession);
        else setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isFormOpen) {
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
  }, [isFormOpen]);

  // Load data on login or refresh
  useEffect(() => {
    if (!userId) {
      setEntries(SAMPLE_DATA);
      setGoals([]);
      setCustomLists([]);
      setChallengeStart(null);
      setPreferences({ mood: 'cinematic', volume: 0.5 });
      setAuthLoading(false);
      return;
    }

    const loadAllData = async () => {
      setAuthLoading(true);
      try {
        // 1. Try Cloud Data First
        const cloudData = await loadUserDataFromCloud(userId);
      
      if (cloudData && Object.keys(cloudData).length > 0) {
        setEntries(cloudData.entries || []);
        setGoals(cloudData.goals || []);
        setCustomLists(cloudData.lists || []);
        setChallengeStart(cloudData.challenge || null);
        setPreferences(cloudData.preferences || { mood: 'cinematic', volume: 0.5 });
        setDailyPick(cloudData.dailyPick || null);
      } else {
        // 2. Migration Bridge: Check LocalStorage for this ID or ANY legacy ID
        let migrationSource = userId;
        const localEntries = loadUserData(userId, 'entries', null);
        
        if (!localEntries) {
          // If no data for current ID, check for any legacy id in this browser
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('cinetrack_') && key.endsWith('_entries')) {
               migrationSource = key.split('_')[1];
               break;
            }
          }
        }

        const savedEntries = loadUserData(migrationSource, 'entries', null);
        if (savedEntries) {
          console.log(`Migrating data from ${migrationSource} to cloud...`);
          const legacyData: UserData = {
            entries: savedEntries,
            goals: loadUserData(migrationSource, 'goals', []),
            lists: loadUserData(migrationSource, 'lists', []),
            challenge: loadUserData(migrationSource, 'challenge', null),
            preferences: loadUserData(migrationSource, 'preferences', { mood: 'cinematic', volume: 0.5 }),
            dailyPick: loadUserData(migrationSource, 'dailyPick', null)
          };
          
          setEntries(legacyData.entries);
          setGoals(legacyData.goals);
          setCustomLists(legacyData.lists);
          setChallengeStart(legacyData.challenge);
          setPreferences(legacyData.preferences);
          setDailyPick(legacyData.dailyPick);
          
          // Push to cloud immediately
          await syncAllDataToCloud(userId, legacyData);
          setShowToast(true); // Notify user of sync
        } else {
          setEntries(SAMPLE_DATA);
        }
      }
      } catch (error: any) {
        console.error("Critical error in loadAllData:", error);
        // Ensure we don't stay in loading state forever
        setAuthLoading(false);
        if (error.message?.includes('permission') || error.code === 'permission-denied') {
          alert("⚠️ Could not load your data from the Cloud: Firebase Firestore Permissions Denied.");
        } else {
          console.warn("Falling back to local data due to error");
          setEntries(SAMPLE_DATA);
        }
      } finally {
        setAuthLoading(false);
        console.log("Initialization complete. Entries count:", entries.length);
      }
    };

    loadAllData();
  }, [userId]);

  // Save data instantly on every change
  const persistData = async (type: string, data: any) => {
    if (!userId) return;
    setIsSyncing(true);
    
    // Save to LocalStorage (Fallback)
    saveUserData(userId, type, data);
    
    // Sync to Cloud (Primary)
    try {
      await saveUserDataToCloud(userId, type, data);
    } catch (e: any) {
      console.error("Cloud sync failed:", e);
      if (e.message?.includes('permission') || e.code === 'permission-denied') {
        alert("⚠️ Cloud Sync Failed: Firebase Firestore Permissions Denied. Please go to the Firebase Console -> Firestore Database -> Rules, and set them to allow read/write for authenticated users.");
      }
    }
    
    setTimeout(() => setIsSyncing(false), 300);
  };

  const handleLogin = (id: string, displayName?: string) => {
    setUserSession(id);
    setUserId(id);
  };

  const handleLogout = async () => {
    await auth.signOut();
    clearUserSession();
    setUserId(null);
    setActiveTab('dashboard');
  };

  // Handle global director click
  useEffect(() => {
    const handleDirectorClick = (e: any) => {
      setSelectedDirector(e.detail);
    };
    window.addEventListener('cinetrack_director_click', handleDirectorClick);
    return () => window.removeEventListener('cinetrack_director_click', handleDirectorClick);
  }, []);

  const handleAddEntry = async (newEntry: Entry) => {
    if (!userId) return;
    const entryWithId = { ...newEntry, id: Math.random().toString(36).substr(2, 9) };
    const newEntries = [entryWithId, ...entries];
    setEntries(newEntries);
    persistData('entries', newEntries);
    
    if (pendingListId) {
      handleToggleEntryInList(pendingListId, entryWithId.id);
      setPendingListId(null);
    }
  };

  const handleUpdateEntry = async (updatedEntry: Entry) => {
    if (!userId) return;
    const newEntries = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
    setEntries(newEntries);
    persistData('entries', newEntries);
    
    setIsFormOpen(false);
    setEditingEntry(null);

    const oldEntry = entries.find(e => e.id === updatedEntry.id);
    if (oldEntry?.status !== 'Completed' && updatedEntry.status === 'Completed') {
      setJournalEntry(updatedEntry);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!userId) return;
    const newEntries = entries.filter(e => e.id !== id);
    setEntries(newEntries);
    persistData('entries', newEntries);
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const handleAddGoal = async (goal: Goal) => {
    if (!userId) return;
    let newGoals;
    if (goal.id && goals.some(g => g.id === goal.id)) {
      newGoals = goals.map(g => g.id === goal.id ? goal : g);
    } else {
      newGoals = [...goals, { ...goal, id: Math.random().toString(36).substr(2, 9) }];
    }
    setGoals(newGoals);
    persistData('goals', newGoals);
  };

  const handleDeleteGoal = async (id: string) => {
    if (!userId) return;
    const newGoals = goals.filter(g => g.id !== id);
    setGoals(newGoals);
    persistData('goals', newGoals);
  };

  const handleBulkUpdate = async (ids: string[], status: Entry['status']) => {
    if (!userId) return;
    const newEntries = entries.map(e => {
      if (ids.includes(e.id)) {
        return {
          ...e,
          status,
          watchedDate: status === 'Completed' ? new Date().toISOString() : e.watchedDate
        };
      }
      return e;
    });
    setEntries(newEntries);
    persistData('entries', newEntries);

    const newlyCompleted = entries.find(e => ids.includes(e.id) && status === 'Completed');
    if (newlyCompleted) {
      setJournalEntry({ ...newlyCompleted, status, watchedDate: new Date().toISOString() });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!userId) return;
    const newEntries = entries.filter(e => !ids.includes(e.id));
    setEntries(newEntries);
    persistData('entries', newEntries);
  };

  const handleDeleteAllEntries = async () => {
    if (!userId) return;
    if (!window.confirm("⚠️ ARE YOU ABSOLUTELY SURE? This will permanently delete ALL your movies, goals, and lists from CineTrack. This cannot be undone.")) {
      return;
    }
    
    setEntries([]);
    setGoals([]);
    setCustomLists([]);
    setChallengeStart(null);
    setDailyPick(null);
    
    const cleanData = {
      entries: [],
      goals: [],
      lists: [],
      challenge: null,
      preferences,
      dailyPick: null
    };
    
    await syncAllDataToCloud(userId, cleanData);
    alert("CineTrack has been reset to a clean slate (₹0 entries).");
  };

  const handleCreateList = async (list: Partial<CustomList>) => {
    if (!userId) return;
    const newList: CustomList = {
      id: Math.random().toString(36).substr(2, 9),
      name: list.name || 'New List',
      description: list.description || '',
      entryIds: list.entryIds || [],
      createdAt: new Date().toISOString(),
      color: list.color || '#3b82f6'
    };
    const newLists = [...customLists, newList];
    setCustomLists(newLists);
    persistData('lists', newLists);
  };

  const handleDeleteList = async (id: string) => {
    if (!userId) return;
    const newLists = customLists.filter(l => l.id !== id);
    setCustomLists(newLists);
    persistData('lists', newLists);
  };

  const handleStartChallenge = () => {
    const today = new Date().toISOString();
    setChallengeStart(today);
    persistData('challenge', today);
  };

  const handleResetChallenge = () => {
    setChallengeStart(null);
    persistData('challenge', null);
  };

  const handleUpdatePreferences = (newPrefs: any) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    persistData('preferences', updated);
  };

  const handleUpdateDailyPick = (pick: { id: string; date: string } | null) => {
    setDailyPick(pick);
    persistData('dailyPick', pick);
  };

  const handleUpdateList = async (updatedList: CustomList) => {
    if (!userId) return;
    const newLists = customLists.map(l => l.id === updatedList.id ? updatedList : l);
    setCustomLists(newLists);
    persistData('lists', newLists);
  };

  const handleToggleEntryInList = async (listId: string, entryId: string) => {
    if (!userId) return;
    const list = customLists.find(l => l.id === listId);
    if (!list) return;

    const isInList = list.entryIds.includes(entryId);
    const newEntryIds = isInList 
      ? list.entryIds.filter(id => id !== entryId)
      : [...list.entryIds, entryId];

    const newLists = customLists.map(l => l.id === listId ? { ...l, entryIds: newEntryIds } : l);
    setCustomLists(newLists);
    persistData('lists', newLists);
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
    setPendingListId(null);
    setIsFormOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!userId) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const handleSeedData = async () => {
    if (!userId || isSeeding) return;
    setIsSeeding(true);
    try {
      const seededEntries = SAMPLE_DATA.map(entry => ({
        ...entry,
        id: Math.random().toString(36).substr(2, 9),
        addedAt: new Date().toISOString()
      }));
      const newEntries = [...seededEntries, ...entries];
      setEntries(newEntries);
      persistData('entries', newEntries);
    } catch (error) {
      console.error("Error seeding data:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12">
            <DailyPick 
              entries={entries} 
              savedPick={dailyPick}
              onUpdatePick={handleUpdateDailyPick}
              onStartWatching={(entry) => handleUpdateEntry({ ...entry, status: 'Watching' })}
              onSelect={setSelectedEntry}
            />
            <Dashboard 
              entries={entries} 
              onUpdate={handleUpdateEntry} 
              onDelete={handleDeleteEntry}
              onBulkUpdate={handleBulkUpdate}
              onBulkDelete={handleBulkDelete}
              onAdd={handleAddEntry}
              onEdit={handleEditEntry}
              onSelect={setSelectedEntry}
              onSeed={handleSeedData}
              isSeeding={isSeeding}
            />
          </div>
        );
      case 'watchlist':
        return (
          <Dashboard 
            entries={entries} 
            onUpdate={handleUpdateEntry} 
            onDelete={handleDeleteEntry}
            onBulkUpdate={handleBulkUpdate}
            onBulkDelete={handleBulkDelete}
            onAdd={handleAddEntry}
            onEdit={handleEditEntry}
            onSelect={setSelectedEntry}
            onSeed={handleSeedData}
            isSeeding={isSeeding}
            initialFilter="Want to Watch"
          />
        );
      case 'profile':
        return (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">
            <header className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 bg-zinc-900/30 border border-white/5 p-8 md:p-12 rounded-[3rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors duration-1000" />
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10 w-full">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-[2rem] bg-gradient-to-br from-blue-500 to-purple-500 p-1 shadow-2xl shrink-0">
                  <div className="w-full h-full rounded-[1.8rem] bg-zinc-900 flex items-center justify-center">
                    <User className="w-12 h-12 md:w-14 md:h-14 text-white" />
                  </div>
                </div>
                
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div className="space-y-1">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-display leading-none truncate max-w-[15ch] lg:max-w-md">
                      {auth.currentUser?.displayName || userId}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 lowercase tracking-widest truncate max-w-[25ch] lg:max-w-md">
                      {auth.currentUser?.email || userId}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 items-center md:items-start pt-2">
                    {/* Primary Actions */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <button 
                        onClick={() => setShowWrapped(true)}
                        className="px-6 py-3 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                      >
                        <Sparkles className="w-4 h-4" />
                        View Wrapped
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <button 
                        onClick={() => {
                          const legacyId = window.prompt("Enter your old User ID (e.g. AJK) to recover posters from:");
                          if (!legacyId) return;
                          const id = legacyId.trim().toLowerCase();
                          const savedEntries = loadUserData(id, 'entries', null);
                          if (!savedEntries) {
                            alert(`No data found on this device for ID: "${id}".`);
                            return;
                          }
                          
                          let recoveredCount = 0;
                          const updatedEntries = entries.map(currentEntry => {
                            if (!currentEntry.posterUrl) {
                              const match = savedEntries.find((e: Entry) => e.title.toLowerCase() === currentEntry.title.toLowerCase());
                              if (match && match.posterUrl) {
                                recoveredCount++;
                                return { ...currentEntry, posterUrl: match.posterUrl };
                              }
                            }
                            return currentEntry;
                          });

                          if (recoveredCount === 0) {
                            alert("Could not find any missing posters in the old data.");
                            return;
                          }

                          if (window.confirm(`Found ${recoveredCount} missing posters! Do you want to apply them to your current list?`)) {
                            setEntries(updatedEntries);
                            const legacyData = {
                              entries: updatedEntries,
                              goals,
                              lists: customLists,
                              challenge: challengeStart,
                              preferences,
                              dailyPick
                            };
                            syncAllDataToCloud(userId!, legacyData)
                              .then(() => alert(`Successfully recovered ${recoveredCount} posters!`))
                              .catch(e => alert("Failed to sync to cloud: " + e.message));
                          }
                        }}
                        className="px-4 py-2.5 bg-neon-purple/10 text-neon-purple rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:bg-neon-purple/20 transition-all border border-neon-purple/20"
                      >
                        <ImageIcon className="w-3 h-3" />
                        Recover Posters
                      </button>
                      <ImportCSVButton 
                        onImport={(importedEntries) => {
                          if (window.confirm(`Found ${importedEntries.length} movies in CSV. This will OVERWRITE your current cloud data. Proceed?`)) {
                            setEntries(importedEntries);
                            const legacyData = {
                              entries: importedEntries,
                              goals: goals,
                              lists: customLists,
                              challenge: challengeStart,
                              preferences: preferences,
                              dailyPick: dailyPick
                            };
                            syncAllDataToCloud(userId!, legacyData)
                              .then(() => alert(`Successfully imported ${importedEntries.length} movies!`))
                              .catch(e => alert("Failed to sync to cloud: " + e.message));
                          }
                        }}
                        className="px-4 py-2.5 bg-zinc-800 text-white border border-white/5 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:bg-zinc-700 transition-all"
                      />
                      <ExportButton 
                        entries={entries} 
                        username={userId || 'User'} 
                        customLists={customLists}
                        className="!w-auto !h-auto px-4 py-2.5 bg-zinc-800 text-white rounded-xl font-black uppercase tracking-widest text-[9px] border border-white/5 hover:bg-zinc-700 transition-all"
                        onExportComplete={() => {
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 3000);
                        }}
                      />
                      <button 
                        onClick={handleDeleteAllEntries}
                        className="px-4 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                      >
                        <Database className="w-3 h-3" />
                        Clear All Data
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="px-4 py-2.5 bg-zinc-800 text-white border border-white/5 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
                      >
                        <LogOut className="w-3 h-3" />
                        Sign Out
                      </button>
                      {entries.length === 0 && (
                        <button 
                          onClick={handleSeedData}
                          disabled={isSeeding}
                          className="px-4 py-2.5 bg-purple-500/20 text-purple-500 border border-purple-500/30 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          {isSeeding ? (
                            <div className="w-3 h-3 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                          ) : (
                            <Film className="w-3 h-3" />
                          )}
                          {isSeeding ? 'Loading...' : 'Sample Data'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Block */}
                <div className="flex gap-8 md:gap-12 relative z-10 pt-6 md:pt-0 shrink-0 md:border-l border-white/5 md:pl-12">
                  <div className="text-center space-y-1">
                    <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">{entries.filter(e => e.status === 'Completed').length}</span>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">Watched</p>
                  </div>
                  <div className="w-px h-10 md:h-12 bg-white/10 mt-2" />
                  <div className="text-center space-y-1">
                    <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">{entries.filter(e => e.status === 'Want to Watch').length}</span>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">Watchlist</p>
                  </div>
                  <div className="w-px h-10 md:h-12 bg-white/10 mt-2" />
                  <div className="text-center space-y-1">
                    <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">{entries.filter(e => e.favorite).length}</span>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">Favorites</p>
                  </div>
                </div>
              </div>
            </header>

            <TrophyShelf entries={entries} />
          </div>
        );
      case 'challenge':
        return (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <ChallengeTracker 
              entries={entries} 
              startDate={challengeStart}
              onStart={handleStartChallenge}
              onReset={handleResetChallenge}
            />
          </div>
        );
      case 'journal':
        return <MyJournal entries={entries} onSelect={setSelectedEntry} />;
      case 'goals':
        return (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <WatchGoals 
              entries={entries} 
              goals={goals} 
              onAddGoal={handleAddGoal} 
              onDeleteGoal={handleDeleteGoal} 
            />
          </div>
        );
      case 'map':
        return <WorldCinemaMap entries={entries} onSelect={setSelectedEntry} />;
      case 'evolution':
        return (
          <TasteEvolution 
            entries={entries} 
            username={userId || 'User'} 
            customLists={customLists}
            onExportComplete={() => {
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
          />
        );
      case 'lists':
        return (
          <CustomLists 
            entries={entries} 
            lists={customLists}
            onAddList={handleCreateList}
            onDeleteList={handleDeleteList}
            onUpdateList={handleUpdateList}
            onSelectEntry={setSelectedEntry}
            onUpdateEntry={handleUpdateEntry}
            onEditEntry={handleEditEntry}
            onToggleEntryInList={handleToggleEntryInList}
            onAddNew={(listId) => {
              setPendingListId(listId);
              setIsFormOpen(true);
            }}
          />
        );
      case 'arena':
        return (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <WeeklyChallenge entries={entries} />
          </div>
        );
      default:
        return null;
    }
  };

    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500 selection:text-white flex">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[100] bg-zinc-900 border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Success</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">✅ Your CineTrack data has been exported!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation - Hidden on Mobile */}
      <aside className="hidden sm:flex fixed top-0 left-0 bottom-0 w-20 lg:w-64 bg-black/80 backdrop-blur-xl border-r border-white/5 z-50 flex-col">
        <div className="p-6 flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 bg-white text-black rounded-xl flex-shrink-0 flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">CT</div>
          <span className="hidden lg:block text-xl font-black text-white uppercase tracking-tighter font-display group-hover:text-blue-500 transition-colors">CineTrack</span>
        </div>

        <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Feed' },
            { id: 'watchlist', icon: Bookmark, label: 'Watchlist' },
            { id: 'lists', icon: List, label: 'Lists' },
            { id: 'journal', icon: Book, label: 'Journal' },
            { id: 'goals', icon: Target, label: 'Goals' },
            { id: 'map', icon: Globe, label: 'Map' },
            { id: 'evolution', icon: TrendingUp, label: 'Evolution' },
            { id: 'arena', icon: Trophy, label: 'Arena' },
            { id: 'challenge', icon: Calendar, label: '30 Day' },
            { id: 'profile', icon: User, label: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                activeTab === tab.id 
                  ? "bg-white text-black shadow-xl scale-105" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:block">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 space-y-3">
          <button
            onClick={() => {
              setEditingEntry(null);
              setPendingListId(null);
              setIsFormOpen(true);
            }}
            className="w-full h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Plus className="w-6 h-6" />
            <span className="hidden lg:block font-black uppercase tracking-widest text-[10px]">Add New</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 text-gray-500 hover:text-red-500 transition-colors font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/5"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:block">Sign Out</span>
          </button>
        </div>

        {isSyncing && (
          <div className="px-6 py-4 flex items-center gap-2 text-blue-500 animate-pulse">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-[8px] font-black uppercase tracking-widest">Syncing...</span>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 sm:ml-20 lg:ml-64">
        <main className="pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <QuickLog onSave={handleAddEntry} allEntries={entries} />
      
      <div className="fixed bottom-24 right-6 sm:bottom-8 sm:left-8 z-[100]">
        <MoodMusicPlayer 
          preferences={preferences}
          onUpdatePreferences={handleUpdatePreferences}
        />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab as Tab)} 
        onAddClick={() => {
          setEditingEntry(null);
          setIsFormOpen(true);
        }}
      />


      <AnimatePresence>
        {journalEntry && (
          <JournalModal 
            entry={journalEntry} 
            onSave={(updated) => {
              handleUpdateEntry(updated);
              setJournalEntry(null);
            }}
            onClose={() => setJournalEntry(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDirector && (
          <DirectorProfile 
            directorName={selectedDirector} 
            entries={entries} 
            onClose={() => setSelectedDirector(null)}
            onAddEntry={handleAddEntry}
            onSelectDirector={setSelectedDirector}
          />
        )}
      </AnimatePresence>

      {showWrapped && (
        <CinematicWrapped entries={entries} onClose={() => setShowWrapped(false)} />
      )}

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <DetailView 
            entry={selectedEntry} 
            lists={customLists}
            onClose={() => setSelectedEntry(null)}
            onEdit={() => {
              handleEditEntry(selectedEntry);
              setSelectedEntry(null);
            }}
            onToggleList={handleToggleEntryInList}
          />
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsFormOpen(false);
                setEditingEntry(null);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div className="relative z-10 w-full max-w-4xl">
              <EntryForm 
                entry={editingEntry}
                allEntries={entries}
                onSave={editingEntry ? handleUpdateEntry : handleAddEntry}
                onDelete={handleDeleteEntry}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingEntry(null);
                }}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
