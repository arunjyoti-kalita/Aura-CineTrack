import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Entry } from '../types';
import { searchTMDB, getTMDBPosterUrl } from '../lib/tmdb';
import { getSimilarity } from '../lib/search';

interface PosterProps {
  entry: Entry;
  className?: string;
  alt?: string;
}

export function Poster({ entry, className, alt }: PosterProps) {
  const [poster, setPoster] = useState<string | null>(entry?.posterUrl || null);

  useEffect(() => {
    if (!entry) return;
    // If we have no poster from the entry and haven't fetched one locally yet
    if (!entry.posterUrl && !poster) {
      const fetchPoster = async () => {
        try {
          const omdbKey = import.meta.env.VITE_OMDB_API_KEY;
          const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;

          // 1. Try TMDB Find API if we have an IMDb ID
          if (entry.imdbId && entry.imdbId !== 'N/A' && tmdbKey) {
            try {
              const findRes = await fetch(`https://api.themoviedb.org/3/find/${entry.imdbId}?api_key=${tmdbKey}&external_source=imdb_id`);
              const findData = await findRes.json();
              const match = findData.movie_results?.[0] || findData.tv_results?.[0];
              if (match?.poster_path) {
                setPoster(getTMDBPosterUrl(match.poster_path));
                return;
              }
            } catch (e) {
              console.error('TMDB Find error:', e);
            }
          }

          // 2. Try OMDB Search
          if (omdbKey) {
            try {
              const { searchOMDB } = await import('../lib/omdb');
              const results = await searchOMDB(entry.title);
              const scoredResults = results.map(r => ({
                ...r,
                similarity: getSimilarity(entry.title, r.Title)
              }));
              const match = scoredResults.sort((a, b) => b.similarity - a.similarity)[0];
              if (match && match.similarity > 0.8 && match.Poster && match.Poster !== 'N/A') {
                setPoster(match.Poster);
                return;
              }
            } catch (e) {
              console.error('OMDB search error:', e);
            }
          }

          // 3. Try TMDB Search
          if (tmdbKey) {
            const tmdbResults = await searchTMDB(entry.title);
            const tmdbMatch = tmdbResults.find(r => 
              (r.title && getSimilarity(entry.title, r.title) > 0.8) ||
              (r.name && getSimilarity(entry.title, r.name) > 0.8)
            );

            if (tmdbMatch?.poster_path) {
              setPoster(getTMDBPosterUrl(tmdbMatch.poster_path));
            }
          }
        } catch (error) {
          console.error('Error fetching poster:', error);
        }
      };
      fetchPoster();
    } else if (entry.posterUrl && entry.posterUrl !== poster) {
      // Keep in sync if parent updates
      setPoster(entry.posterUrl);
    }
  }, [entry?.title, entry?.posterUrl]);

  if (!entry) return null;

  if (!poster) {
    return (
      <div className={`${className} flex items-center justify-center bg-zinc-800`}>
        <Play className="w-8 h-8 text-zinc-700" />
      </div>
    );
  }

  return (
    <img 
      src={poster} 
      alt={alt || entry.title} 
      className={className}
      referrerPolicy="no-referrer"
    />
  );
}
