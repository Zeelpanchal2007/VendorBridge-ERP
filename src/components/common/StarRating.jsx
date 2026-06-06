import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, maxRating = 5, onRate, readonly = false, size = 24 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    if (!readonly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHoverRating(0);
  };

  const handleClick = (index) => {
    if (!readonly && onRate) {
      onRate(index);
    }
  };

  return (
    <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hoverRating || rating);
        
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            className={`transition-all duration-300 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onClick={() => handleClick(starValue)}
          >
            <Star
              size={size}
              className={`${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'} transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
