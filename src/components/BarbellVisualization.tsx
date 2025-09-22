import React from 'react';

interface BarbellVisualizationProps {
  weight: number;
  className?: string;
}

const BarbellVisualization: React.FC<BarbellVisualizationProps> = ({ weight, className = "" }) => {
  // Calculate plates needed for each side
  const calculatePlates = (totalWeight: number) => {
    const barWeight = 20; // Standard barbell weight
    const plateWeight = (totalWeight - barWeight) / 2; // Weight per side
    
    const plates = [];
    let remainingWeight = plateWeight;
    
    // Standard plate sizes (kg) - Olympic plates
    const plateSizes = [25, 20, 15, 10, 5, 2.5, 1.25];
    
    for (const size of plateSizes) {
      const count = Math.floor(remainingWeight / size);
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          plates.push(size);
        }
        remainingWeight -= count * size;
      }
    }
    
    return plates;
  };

  const plates = calculatePlates(weight);

  // Get plate color based on weight (Olympic standard colors)
  const getPlateColor = (plateSize: number) => {
    switch (plateSize) {
      case 25: return '#FF0000'; // Red
      case 20: return '#0000FF'; // Blue  
      case 15: return '#FFFF00'; // Yellow
      case 10: return '#00FF00'; // Green
      case 5: return '#FFFFFF'; // White
      case 2.5: return '#FFA500'; // Orange
      case 1.25: return '#800080'; // Purple
      default: return '#808080'; // Gray
    }
  };

  // Get plate size for visualization
  const getPlateSize = (plateSize: number) => {
    const baseSize = 6;
    const multiplier = Math.sqrt(plateSize / 2.5); // Square root for more realistic proportions
    return Math.max(baseSize, baseSize * multiplier);
  };

  // Get plate stroke color (darker for contrast)
  const getPlateStroke = (plateSize: number) => {
    return plateSize === 5 ? '#000000' : '#2C3E50'; // Black stroke for white plates
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width="140" height="50" viewBox="0 0 140 50" className="overflow-visible">
        {/* Barbell bar */}
        <rect x="15" y="22" width="110" height="6" fill="#8B4513" rx="3" />
        <rect x="15" y="24" width="110" height="2" fill="#654321" rx="1" />
        
        {/* Left side plates */}
        {plates.slice(0, Math.ceil(plates.length / 2)).map((plate, index) => {
          const size = getPlateSize(plate);
          const color = getPlateColor(plate);
          const strokeColor = getPlateStroke(plate);
          const y = 25 - size / 2;
          const x = 15 - (index + 1) * (size + 1);
          
          return (
            <rect
              key={`left-${index}`}
              x={x}
              y={y}
              width={size}
              height={size}
              fill={color}
              rx="1"
              stroke={strokeColor}
              strokeWidth="0.5"
            />
          );
        })}
        
        {/* Right side plates */}
        {plates.slice(Math.ceil(plates.length / 2)).map((plate, index) => {
          const size = getPlateSize(plate);
          const color = getPlateColor(plate);
          const strokeColor = getPlateStroke(plate);
          const y = 25 - size / 2;
          const x = 125 + (index + 1) * (size + 1);
          
          return (
            <rect
              key={`right-${index}`}
              x={x}
              y={y}
              width={size}
              height={size}
              fill={color}
              rx="1"
              stroke={strokeColor}
              strokeWidth="0.5"
            />
          );
        })}
        
        {/* Weight text */}
        <text
          x="70"
          y="42"
          textAnchor="middle"
          className="text-xs font-bold fill-current"
          style={{ fontSize: '11px' }}
        >
          {weight}kg
        </text>
        
        {/* Plate weight indicators (small text on plates) */}
        {plates.slice(0, Math.ceil(plates.length / 2)).map((plate, index) => {
          const size = getPlateSize(plate);
          const x = 15 - (index + 1) * (size + 1) + size / 2;
          const y = 25;
          
          return (
            <text
              key={`left-text-${index}`}
              x={x}
              y={y}
              textAnchor="middle"
              className="text-xs font-bold fill-current"
              style={{ fontSize: '8px' }}
            >
              {plate}
            </text>
          );
        })}
        
        {plates.slice(Math.ceil(plates.length / 2)).map((plate, index) => {
          const size = getPlateSize(plate);
          const x = 125 + (index + 1) * (size + 1) + size / 2;
          const y = 25;
          
          return (
            <text
              key={`right-text-${index}`}
              x={x}
              y={y}
              textAnchor="middle"
              className="text-xs font-bold fill-current"
              style={{ fontSize: '8px' }}
            >
              {plate}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default BarbellVisualization;
