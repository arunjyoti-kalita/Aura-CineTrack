import { Entry, CustomList } from '../types';

export const formatCSVDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const escapeCSV = (val: any): string => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const convertToCSV = (entries: Entry[], username: string, customLists: CustomList[]): string => {
  const headers = [
    'Status', 'Title', 'Type', 'Year', 'Director', 'Genre', 'Sub-Genre', 'Lead Actor', 'Lead Actress', 
    'Key Supporting Actor', 'Studio', 'Country', 'Language', 'Runtime (mins)', 'IMDb Rating', 
    'My Rating', 'Watched Date', 'Rewatchable', 'Mood', 'Oscar Wins', 'Based On', 'Franchise', 
    'Composer', 'Cinematographer', 'My One-Line Review', 'My Notes', 'Memorable Quote', 
    'Mood Reaction', 'Would Recommend', 'Times Rewatched', 'Platform/Where Watched', 'Tags', 
    'Custom List', 'Date Added to App'
  ];

  const mapStatus = (status: string) => {
    switch (status) {
      case 'Completed': return 'Watched';
      case 'Watching': return 'Watching';
      case 'Want to Watch': return 'Want to Watch';
      default: return status;
    }
  };

  // Sort entries
  const watched = entries
    .filter(e => e.status === 'Completed')
    .sort((a, b) => {
      const dateA = a.watchedDate ? new Date(a.watchedDate).getTime() : 0;
      const dateB = b.watchedDate ? new Date(b.watchedDate).getTime() : 0;
      return dateB - dateA;
    });
  
  const watching = entries.filter(e => e.status === 'Watching');
  const wantToWatch = entries.filter(e => e.status === 'Want to Watch');

  const sortedEntries = [...watched, ...watching, ...wantToWatch];

  const rows = sortedEntries.map(e => {
    const lists = customLists
      .filter(l => l.entryIds.includes(e.id))
      .map(l => l.name)
      .join(', ');

    return [
      mapStatus(e.status),
      e.title,
      e.type,
      e.year,
      e.director,
      e.genre,
      e.subGenre || '',
      e.leadActor || '',
      e.leadActress || '',
      e.supportingActor || '',
      '', // Studio (not in Entry type)
      e.country,
      e.language,
      e.runtime,
      e.imdbRating,
      e.myRating || '',
      formatCSVDate(e.watchedDate),
      e.rewatchable ? 'Yes' : 'No',
      e.mood || '',
      e.oscarEmmyWins || '',
      e.basedOn || '',
      e.franchise || '',
      '', // Composer (not in Entry type)
      '', // Cinematographer (not in Entry type)
      e.review || '',
      e.journalNotes || '',
      e.memorableQuote || '',
      e.journalMood || '',
      e.recommend ? 'Yes' : 'No',
      '', // Times Rewatched (not in Entry type)
      e.platform || '',
      (e.tags || []).join(', '),
      lists,
      formatCSVDate(e.addedAt)
    ].map(escapeCSV).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

export const exportToCSV = (entries: Entry[], username: string, customLists: CustomList[]) => {
  const csvContent = convertToCSV(entries, username, customLists);
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const filename = `CineTrack_${username}_${day}-${month}-${year}.csv`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
