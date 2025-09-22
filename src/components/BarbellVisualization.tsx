import React from 'react';

interface BarbellVisualizationProps {
  weight: number;
  equipment: string;
  className?: string;
}

const BarbellVisualization: React.FC<BarbellVisualizationProps> = ({ weight, equipment, className = "" }) => {
  // Only show barbell visualization for barbell exercises
  if (equipment !== "Barra") {
    return null;
  }
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
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="text-xs text-muted-foreground mb-1 font-medium">
        Configuração da Barra
      </div>
      <svg width="160" height="60" viewBox="0 0 160 60" className="overflow-visible">
        {/* Barbell bar with 3D effect */}
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#654321" />
            <stop offset="100%" stopColor="#4A2C17" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Barbell bar */}
        <rect x="20" y="26" width="120" height="8" fill="url(#barGradient)" rx="4" filter="url(#shadow)" />
        <rect x="20" y="28" width="120" height="4" fill="#654321" rx="2" />
        
        {/* Bar collars */}
        <rect x="15" y="28" width="8" height="4" fill="#C0C0C0" rx="2" />
        <rect x="137" y="28" width="8" height="4" fill="#C0C0C0" rx="2" />
        
        {/* Left side plates */}
        {plates.slice(0, Math.ceil(plates.length / 2)).map((plate, index) => {
          const size = getPlateSize(plate);
          const color = getPlateColor(plate);
          const strokeColor = getPlateStroke(plate);
          const y = 30 - size / 2;
          const x = 20 - (index + 1) * (size + 1.5);
          
          return (
            <g key={`left-${index}`}>
              <rect
                x={x}
                y={y}
                width={size}
                height={size}
                fill={color}
                rx="2"
                stroke={strokeColor}
                strokeWidth="0.8"
                filter="url(#shadow)"
              />
              <text
                x={x + size / 2}
                y={y + size / 2 + 2}
                textAnchor="middle"
                className="text-xs font-bold fill-current"
                style={{ fontSize: '7px' }}
              >
                {plate}
              </text>
            </g>
          );
        })}
        
        {/* Right side plates */}
        {plates.slice(Math.ceil(plates.length / 2)).map((plate, index) => {
          const size = getPlateSize(plate);
          const color = getPlateColor(plate);
          const strokeColor = getPlateStroke(plate);
          const y = 30 - size / 2;
          const x = 140 + (index + 1) * (size + 1.5);
          
          return (
            <g key={`right-${index}`}>
              <rect
                x={x}
                y={y}
                width={size}
                height={size}
                fill={color}
                rx="2"
                stroke={strokeColor}
                strokeWidth="0.8"
                filter="url(#shadow)"
              />
              <text
                x={x + size / 2}
                y={y + size / 2 + 2}
                textAnchor="middle"
                className="text-xs font-bold fill-current"
                style={{ fontSize: '7px' }}
              >
                {plate}
              </text>
            </g>
          );
        })}
        
        {/* Total weight display */}
        <rect x="60" y="45" width="40" height="12" fill="rgba(0,0,0,0.1)" rx="6" />
        <text
          x="80"
          y="54"
          textAnchor="middle"
          className="text-xs font-bold fill-current"
          style={{ fontSize: '10px' }}
        >
          {weight}kg
        </text>
      </svg>
    </div>
  );
};

export default BarbellVisualization;
