import React from 'react';
import ProfessionalBarbellVisualization from './ProfessionalBarbellVisualization';

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

  // Barbell exercises - show professional barbell visualization
  if (equipment === "Barra") {
    return <ProfessionalBarbellVisualization weight={weight} equipment={equipment} className={className} />;
  }

  // Dumbbell exercises - show advanced dumbbell visualization
  if (equipment === "Halteres") {
    const weightPerDumbbell = weight / 2;
    
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="text-xs text-muted-foreground mb-2 font-medium">
          Halteres
        </div>
        <div className="flex items-center gap-6">
          {/* Left dumbbell */}
          <div className="flex items-center">
            <div className="w-1.5 h-10 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-sm"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md border-2 border-blue-300">
              <span className="text-xs font-bold text-white">{weightPerDumbbell}</span>
            </div>
            <div className="w-1.5 h-10 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-sm"></div>
          </div>
          
          {/* Right dumbbell */}
          <div className="flex items-center">
            <div className="w-1.5 h-10 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-sm"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md border-2 border-blue-300">
              <span className="text-xs font-bold text-white">{weightPerDumbbell}</span>
            </div>
            <div className="w-1.5 h-10 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-sm"></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2 bg-muted/50 px-3 py-1 rounded-full">
          {weight}kg total ({weightPerDumbbell}kg cada)
        </div>
      </div>
    );
  }

  // Machine exercises - show machine visualization
  if (equipment === "Máquina") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="text-xs text-muted-foreground mb-2 font-medium">
          Máquina
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center shadow-md border-2 border-gray-400">
            <span className="text-xs font-bold text-white">{weight}</span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">kg</div>
        </div>
        <div className="text-xs text-muted-foreground mt-1 bg-muted/50 px-2 py-1 rounded-full">
          Peso da máquina
        </div>
      </div>
    );
  }

  // Cable exercises - show cable visualization
  if (equipment === "Cabo") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="text-xs text-muted-foreground mb-2 font-medium">
          Cabo
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center shadow-md border-2 border-gray-500">
            <span className="text-xs font-bold text-white">{weight}</span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">kg</div>
        </div>
        <div className="text-xs text-muted-foreground mt-1 bg-muted/50 px-2 py-1 rounded-full">
          Peso do cabo
        </div>
      </div>
    );
  }

  // Bodyweight exercises - show bodyweight visualization
  if (equipment === "Peso Corporal") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="text-xs text-muted-foreground mb-2 font-medium">
          Peso Corporal
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md border-2 border-green-300">
            <span className="text-xs font-bold text-white">BW</span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">Bodyweight</div>
        </div>
        <div className="text-xs text-muted-foreground mt-1 bg-muted/50 px-2 py-1 rounded-full">
          Sem peso adicional
        </div>
      </div>
    );
  }

  // Default case - show simple weight display
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="text-xs text-muted-foreground mb-2 font-medium">
        Peso
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-8 bg-gradient-to-br from-slate-500 to-slate-700 rounded-lg flex items-center justify-center shadow-md border-2 border-slate-400">
          <span className="text-xs font-bold text-white">{weight}</span>
        </div>
        <div className="text-xs text-muted-foreground font-medium">kg</div>
      </div>
      <div className="text-xs text-muted-foreground mt-1 bg-muted/50 px-2 py-1 rounded-full">
        {equipment}
      </div>
    </div>
  );
};

export default EquipmentVisualization;
