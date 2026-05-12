import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '../lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 20, 
  interactive = false, 
  onChange 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!interactive || !onChange) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    
    onChange(index + (isHalf ? 0.5 : 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    
    setHoverRating(index + (isHalf ? 0.5 : 1));
  };

  return (
    <div 
      className={cn("flex items-center gap-1", interactive && "cursor-pointer")}
      onMouseLeave={() => setHoverRating(null)}
    >
      {[...Array(maxRating)].map((_, i) => {
        const full = displayRating >= i + 1;
        const half = displayRating >= i + 0.5 && !full;
        
        return (
          <div 
            key={i}
            className="relative"
            onClick={(e) => handleClick(e, i)}
            onMouseMove={(e) => handleMouseMove(e, i)}
          >
            {half ? (
              <div className="relative">
                <Star size={size} className="text-zinc-800" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star size={size} className="text-neon-yellow fill-neon-yellow" />
                </div>
              </div>
            ) : (
              <Star 
                size={size} 
                className={cn(
                  full ? "text-neon-yellow fill-neon-yellow" : "text-zinc-800",
                  "transition-colors"
                )} 
              />
            )}
          </div>
        );
      })}
      {interactive && displayRating > 0 && (
        <span className="ml-2 text-xs font-black text-neon-yellow uppercase tracking-widest">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
