import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { parseCSV } from '../lib/csvImport';
import { Entry, EntertainmentType } from '../types';
import { cn } from '../lib/utils';
import { getSimilarity } from '../lib/search';

interface ImportCSVButtonProps {
  onImport: (entries: Entry[]) => void;
  className?: string;
}

export function ImportCSVButton({ onImport, className }: ImportCSVButtonProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const text = await file.text();
      const entries = parseCSV(text);
      if (entries.length > 0) {
        setEnrichmentProgress({ current: 0, total: entries.length });
        
        // Enrich entries with OMDb data if missing
        const enrichedEntries: Entry[] = [];
        const { searchOMDB, getOMDBDetails } = await import('../lib/omdb');

        for (let i = 0; i < entries.length; i++) {
          let entry = entries[i];
          setEnrichmentProgress({ current: i + 1, total: entries.length });

          // Only enrich if poster or director is missing
          if (!entry.posterUrl || !entry.director) {
            try {
              const searchResults = await searchOMDB(entry.title);
              
              // Find best match using fuzzy similarity
              const scoredResults = searchResults.map(r => ({
                ...r,
                similarity: getSimilarity(entry.title, r.Title)
              }));
              
              const match = scoredResults.sort((a, b) => b.similarity - a.similarity)[0];

              // Only use if similarity is high enough (e.g., > 0.8)
              if (match && match.similarity > 0.8) {
                const details = await getOMDBDetails(match.imdbID);
                if (details) {
                  entry = {
                    ...entry,
                    posterUrl: entry.posterUrl || (details.Poster !== 'N/A' ? details.Poster : ''),
                    director: entry.director || details.Director,
                    imdbRating: entry.imdbRating || parseFloat(details.imdbRating) || 0,
                    runtime: entry.runtime || parseInt(details.Runtime) || 120,
                    genre: entry.genre || details.Genre.split(',')[0],
                    language: entry.language || details.Language.split(',')[0],
                    country: entry.country || details.Country.split(',')[0],
                  };
                }
              }
            } catch (err) {
              console.warn(`Failed to enrich ${entry.title}`, err);
            }
          }
          enrichedEntries.push(entry);
        }

        onImport(enrichedEntries);
      } else {
        alert('No valid movies found in this CSV.');
      }
    } catch (error) {
      console.error("Import failed:", error);
      alert('Failed to read CSV file.');
    } finally {
      setIsImporting(false);
      setEnrichmentProgress({ current: 0, total: 0 });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className={className || "px-6 py-3 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10"}
      >
        {isImporting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[8px]">
              {enrichmentProgress.total > 0 
                ? `Enriching ${enrichmentProgress.current}/${enrichmentProgress.total}...` 
                : 'Processing...'}
            </span>
          </div>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </>
        )}
      </button>
    </div>
  );
}
