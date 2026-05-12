import { Entry } from '../types';

const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

export const parseCSV = (csvText: string): Entry[] => {
  const lines = csvText.split('\n').filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Skip header
  const dataLines = lines.slice(1);
  const entries: Entry[] = [];

  for (const line of dataLines) {
    const cols = parseCSVLine(line);
    if (cols.length < 5) continue; // Skip malformed lines

    // Map columns back to Entry fields with more flexibility
    const rawStatus = cols[0]?.trim();
    const statusMap: Record<string, string> = {
      'watched': 'Completed',
      'completed': 'Completed',
      'watching': 'Watching',
      'current': 'Watching',
      'want to watch': 'Want to Watch',
      'watchlist': 'Want to Watch',
      'plan to watch': 'Want to Watch',
      'planned': 'Want to Watch',
      'dropped': 'Dropped'
    };

    const mappedStatus = rawStatus ? (statusMap[rawStatus.toLowerCase()] || 
                         Object.entries(statusMap).find(([k]) => rawStatus.toLowerCase().includes(k))?.[1]) : undefined;

    // Date parsing: Handles DD-MM-YYYY, YYYY-MM-DD, and slash formats
    const parseDate = (dateStr: string) => {
      if (!dateStr || dateStr === 'N/A' || dateStr.trim() === '') return undefined;
      try {
        const cleanDate = dateStr.replace(/\//g, '-');
        const parts = cleanDate.split('-');
        if (parts.length === 3) {
          if (parts[0].length === 4) return new Date(cleanDate).toISOString();
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
        }
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
      } catch (e) {
        return undefined;
      }
    };

    const watchedDate = parseDate(cols[16]);
    const myRating = parseFloat(cols[15]);
    
    // Smart status fallback: If it looks like it hasn't been watched, put it in Want to Watch
    const finalStatus = mappedStatus || 
                       ((!watchedDate && (!myRating || isNaN(myRating))) ? 'Want to Watch' : 'Completed');

    const entry: any = {
      id: Math.random().toString(36).substr(2, 9),
      status: finalStatus as any,
      title: cols[1],
      type: (cols[2] as any) || 'Movie',
      year: parseInt(cols[3]) || new Date().getFullYear(),
      director: cols[4] || '',
      genre: cols[5] || '',
      subGenre: cols[6] || undefined,
      leadActor: cols[7] || undefined,
      leadActress: cols[8] || undefined,
      supportingActor: cols[9] || undefined,
      imdbId: cols[10] || undefined, // Map IMDb ID if available (usually col 10 in standard exports)
      country: cols[11] || '',
      language: cols[12] || '',
      runtime: parseInt(cols[13]) || 120,
      imdbRating: parseFloat(cols[14]) || 0,
      myRating: isNaN(myRating) ? undefined : myRating,
      watchedDate: watchedDate,
      rewatchable: cols[17] === 'Yes',
      mood: cols[18] || undefined,
      oscarEmmyWins: parseInt(cols[19]) || undefined,
      basedOn: cols[20] || undefined,
      franchise: cols[21] || undefined,
      review: cols[24] || undefined,
      journalNotes: cols[25] || undefined,
      memorableQuote: cols[26] || undefined,
      journalMood: (cols[27] as any) || undefined,
      recommend: cols[28] === 'Yes',
      platform: cols[30] || undefined,
      tags: cols[31] ? cols[31].split(',').map(t => t.trim()) : [],
      addedAt: parseDate(cols[33]) || new Date().toISOString()
    };

    // Clean undefined values to prevent Firestore errors
    Object.keys(entry).forEach(key => {
      if (entry[key] === undefined) {
        delete entry[key];
      }
    });

    entries.push(entry as Entry);
  }
  return entries;
};
