import React, { useState } from "react";
import { Star } from "lucide-react";

const ScoringComponent = ({ 
  label, 
  value = 3, 
  onChange, 
  disabled = false,
  showLabel = true 
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    if (!disabled && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverValue(0);
    }
  };

  const getStarColor = (index) => {
    const currentValue = hoverValue || value;
    if (index <= currentValue) {
      return "text-yellow-400";
    }
    return "text-gray-300 dark:text-gray-600";
  };

  return (
    <div className="flex flex-col space-y-1">
      {showLabel && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            className={`transition-colors duration-200 ${
              disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"
            }`}
          >
            <Star
              className={`w-5 h-5 transition-colors duration-200 ${getStarColor(rating)}`}
              fill={rating <= (hoverValue || value) ? "currentColor" : "none"}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {value}/5
        </span>
      </div>
    </div>
  );
};

export default ScoringComponent;
