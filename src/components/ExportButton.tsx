import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportToCSV } from '../lib/csvExport';
import { Entry, CustomList } from '../types';
import { cn } from '../lib/utils';

interface ExportButtonProps {
  entries: Entry[];
  username: string;
  customLists: CustomList[];
  className?: string;
  onExportComplete?: () => void;
}

export function ExportButton({ entries, username, customLists, className, onExportComplete }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const hasData = entries.length > 0;

  const handleExport = async () => {
    if (!hasData) return;
    
    setIsExporting(true);
    
    // Simulate brief loading for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      exportToCSV(entries, username, customLists);
      if (onExportComplete) onExportComplete();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!hasData) {
    return (
      <div className={cn("space-y-2", className)}>
        <button
          disabled
          className="w-full h-14 bg-zinc-800/50 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 cursor-not-allowed border border-white/5"
        >
          <Download className="w-4 h-4" />
          ⬇️ Export My Data as CSV
        </button>
        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest text-center">
          Nothing to export yet — start logging movies first!
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={cn(
        "w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:scale-100",
        className
      )}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {isExporting ? 'Preparing File...' : '⬇️ Export My Data as CSV'}
    </button>
  );
}
