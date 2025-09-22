import React from 'react';
import BarbellVisualization from './BarbellVisualization';

interface EquipmentVisualizationProps {
  weight: number;
  equipment: string;
  className?: string;
}

const EquipmentVisualization: React.FC<EquipmentVisualizationProps> = ({ weight, equipment, className = "" }) => {
  // Only show visualization for certain equipment types
  if (weight <= 0) {
    return null;
  }

  // Barbell exercises - show barbell visualization
  if (equipment === "Barra") {
    return <BarbellVisualization weight={weight} equipment={equipment} className={className} />;
  }

  // Dumbbell exercises - show dumbbell visualization
  if (equipment === "Halteres") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="text-xs text-muted-foreground mb-1 font-medium">
          Halteres
        </div>
        <div className="flex items-center gap-4">
          {/* Left dumbbell */}
          <div className="flex items-center">
            <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{weight/2}</span>
            </div>
            <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
          </div>
          
          {/* Right dumbbell */}
          <div className="flex items-center">
            <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{weight/2}</span>
            </div>
            <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {weight}kg total ({weight/2}kg cada)
        </div>
      </div>
    );
  }

  // Machine exercises - show machine visualization
  if (equipment === "Máquina") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="text-xs text-muted-foreground mb-1 font-medium">
          Máquina
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-gray-600 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-white">{weight}</span>
          </div>
          <div className="text-xs text-muted-foreground">kg</div>
        </div>
      </div>
    );
  }

  // Cable exercises - show cable visualization
  if (equipment === "Cabo") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="text-xs text-muted-foreground mb-1 font-medium">
          Cabo
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-8 bg-gray-700 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-white">{weight}</span>
          </div>
          <div className="text-xs text-muted-foreground">kg</div>
        </div>
      </div>
    );
  }

  // Bodyweight exercises - show bodyweight visualization
  if (equipment === "Peso Corporal") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="text-xs text-muted-foreground mb-1 font-medium">
          Peso Corporal
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">BW</span>
          </div>
          <div className="text-xs text-muted-foreground">Bodyweight</div>
        </div>
      </div>
    );
  }

  // Default case - show simple weight display
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="text-xs text-muted-foreground mb-1 font-medium">
        Peso
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-6 bg-gray-500 rounded flex items-center justify-center">
          <span className="text-xs font-bold text-white">{weight}</span>
        </div>
        <div className="text-xs text-muted-foreground">kg</div>
      </div>
    </div>
  );
};

export default EquipmentVisualization;
