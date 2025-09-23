import React, { useRef, useEffect } from 'react';

interface AdvancedBarbellVisualizationProps {
  weight: number;
  equipment: string;
  className?: string;
}

const AdvancedBarbellVisualization: React.FC<AdvancedBarbellVisualizationProps> = ({ 
  weight, 
  equipment, 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Only show for barbell exercises
  if (equipment !== "Barra" || weight <= 0) {
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 80;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate plates needed
    const barWeight = 20;
    const plateWeight = (weight - barWeight) / 2;
    
    const plateSizes = [25, 20, 15, 10, 5, 2.5, 1.25];
    const plates = [];
    let remainingWeight = plateWeight;
    
    for (const size of plateSizes) {
      const count = Math.floor(remainingWeight / size);
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          plates.push(size);
        }
        remainingWeight -= count * size;
      }
    }

    // Plate colors (Olympic standard)
    const plateColors = {
      25: '#FF0000', // Red
      20: '#0000FF', // Blue
      15: '#FFFF00', // Yellow
      10: '#00FF00', // Green
      5: '#FFFFFF',  // White
      2.5: '#FFA500', // Orange
      1.25: '#800080' // Purple
    };

    // Draw barbell bar
    const barY = canvas.height / 2;
    const barStartX = 50;
    const barEndX = canvas.width - 50;
    const barHeight = 8;

    // Bar shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(barStartX + 2, barY + 2, barEndX - barStartX, barHeight);

    // Bar gradient
    const barGradient = ctx.createLinearGradient(0, barY, 0, barY + barHeight);
    barGradient.addColorStop(0, '#8B4513');
    barGradient.addColorStop(0.5, '#654321');
    barGradient.addColorStop(1, '#4A2C17');
    
    ctx.fillStyle = barGradient;
    ctx.fillRect(barStartX, barY, barEndX - barStartX, barHeight);

    // Bar highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(barStartX, barY, barEndX - barStartX, 2);

    // Draw collars
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(barStartX - 8, barY + 1, 8, barHeight - 2);
    ctx.fillRect(barEndX, barY + 1, 8, barHeight - 2);

    // Draw left side plates
    let leftX = barStartX - 8;
    const leftPlates = plates.slice(0, Math.ceil(plates.length / 2));
    
    leftPlates.forEach((plate, index) => {
      const plateSize = Math.max(8, plate * 0.8); // Scale plate size
      const plateColor = plateColors[plate as keyof typeof plateColors] || '#808080';
      
      leftX -= plateSize + 2;
      
      // Plate shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(leftX + 1, barY - plateSize/2 + 1, plateSize, plateSize);
      
      // Plate
      ctx.fillStyle = plateColor;
      ctx.fillRect(leftX, barY - plateSize/2, plateSize, plateSize);
      
      // Plate border
      ctx.strokeStyle = plate === 5 ? '#000000' : '#2C3E50';
      ctx.lineWidth = 1;
      ctx.strokeRect(leftX, barY - plateSize/2, plateSize, plateSize);
      
      // Plate text
      ctx.fillStyle = plate === 5 ? '#000000' : '#FFFFFF';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(plate.toString(), leftX + plateSize/2, barY + 3);
    });

    // Draw right side plates
    let rightX = barEndX + 8;
    const rightPlates = plates.slice(Math.ceil(plates.length / 2));
    
    rightPlates.forEach((plate, index) => {
      const plateSize = Math.max(8, plate * 0.8);
      const plateColor = plateColors[plate as keyof typeof plateColors] || '#808080';
      
      // Plate shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(rightX + 1, barY - plateSize/2 + 1, plateSize, plateSize);
      
      // Plate
      ctx.fillStyle = plateColor;
      ctx.fillRect(rightX, barY - plateSize/2, plateSize, plateSize);
      
      // Plate border
      ctx.strokeStyle = plate === 5 ? '#000000' : '#2C3E50';
      ctx.lineWidth = 1;
      ctx.strokeRect(rightX, barY - plateSize/2, plateSize, plateSize);
      
      // Plate text
      ctx.fillStyle = plate === 5 ? '#000000' : '#FFFFFF';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(plate.toString(), rightX + plateSize/2, barY + 3);
      
      rightX += plateSize + 2;
    });

    // Draw total weight
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(canvas.width/2 - 30, canvas.height - 20, 60, 16);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${weight}kg`, canvas.width/2, canvas.height - 8);

  }, [weight]);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="text-xs text-muted-foreground mb-2 font-medium">
        Configuração da Barra Olímpica
      </div>
      <canvas 
        ref={canvasRef}
        className="border border-border/20 rounded-lg shadow-sm"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div className="text-xs text-muted-foreground mt-1">
        Cores padrão olímpicas: 🔴25kg 🔵20kg 🟡15kg 🟢10kg ⚪5kg 🟠2.5kg 🟣1.25kg
      </div>
    </div>
  );
};

export default AdvancedBarbellVisualization;
