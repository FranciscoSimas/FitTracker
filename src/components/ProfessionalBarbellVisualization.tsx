import React, { useRef, useEffect } from 'react';

interface ProfessionalBarbellVisualizationProps {
  weight: number;
  equipment: string;
  className?: string;
}

const ProfessionalBarbellVisualization: React.FC<ProfessionalBarbellVisualizationProps> = ({ 
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
    canvas.width = 400;
    canvas.height = 120;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Barbell configuration (based on Visual Barbell Calculator)
    const barWeight = 20; // kg
    const plateWeight = (weight - barWeight) / 2;
    
    // Standard Olympic plates (kg)
    const plateSizes = [25, 20, 15, 10, 5, 2.5, 1.25];
    
    // Calculate plates needed
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

    // Olympic plate colors (standard)
    const plateColors = {
      25: '#FF0000', // Red
      20: '#0000FF', // Blue
      15: '#FFFF00', // Yellow
      10: '#00FF00', // Green
      5: '#FFFFFF',  // White
      2.5: '#FFA500', // Orange
      1.25: '#800080' // Purple
    };

    // Drawing constants
    const centerY = canvas.height / 2;
    const barStartX = 80;
    const barEndX = canvas.width - 80;
    const barHeight = 12;
    const barWidth = barEndX - barStartX;

    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw barbell bar with 3D effect
    const barGradient = ctx.createLinearGradient(0, centerY - barHeight/2, 0, centerY + barHeight/2);
    barGradient.addColorStop(0, '#8B4513');
    barGradient.addColorStop(0.3, '#654321');
    barGradient.addColorStop(0.7, '#4A2C17');
    barGradient.addColorStop(1, '#2F1B14');
    
    // Bar shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(barStartX + 3, centerY - barHeight/2 + 3, barWidth, barHeight);
    
    // Bar main
    ctx.fillStyle = barGradient;
    ctx.fillRect(barStartX, centerY - barHeight/2, barWidth, barHeight);
    
    // Bar highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(barStartX, centerY - barHeight/2, barWidth, 3);
    
    // Bar knurling (texture)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const x = barStartX + (i * barWidth / 20);
      ctx.beginPath();
      ctx.moveTo(x, centerY - barHeight/2);
      ctx.lineTo(x, centerY + barHeight/2);
      ctx.stroke();
    }

    // Draw collars
    const collarWidth = 12;
    const collarHeight = barHeight + 4;
    
    // Left collar
    const leftCollarGradient = ctx.createLinearGradient(0, centerY - collarHeight/2, 0, centerY + collarHeight/2);
    leftCollarGradient.addColorStop(0, '#E0E0E0');
    leftCollarGradient.addColorStop(0.5, '#C0C0C0');
    leftCollarGradient.addColorStop(1, '#A0A0A0');
    
    ctx.fillStyle = leftCollarGradient;
    ctx.fillRect(barStartX - collarWidth, centerY - collarHeight/2, collarWidth, collarHeight);
    
    // Right collar
    ctx.fillStyle = leftCollarGradient;
    ctx.fillRect(barEndX, centerY - collarHeight/2, collarWidth, collarHeight);
    
    // Collar shadows
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(barStartX - collarWidth + 2, centerY - collarHeight/2 + 2, collarWidth, collarHeight);
    ctx.fillRect(barEndX + 2, centerY - collarHeight/2 + 2, collarWidth, collarHeight);

    // Draw left side plates
    let leftX = barStartX - collarWidth;
    const leftPlates = plates.slice(0, Math.ceil(plates.length / 2));
    
    leftPlates.forEach((plate, index) => {
      const plateSize = Math.max(12, plate * 1.2); // Scale plate size
      const plateColor = plateColors[plate as keyof typeof plateColors] || '#808080';
      
      leftX -= plateSize + 2;
      
      // Plate shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(leftX + 2, centerY - plateSize/2 + 2, plateSize, plateSize);
      
      // Plate gradient
      const plateGradient = ctx.createRadialGradient(
        leftX + plateSize/2, centerY, 0,
        leftX + plateSize/2, centerY, plateSize/2
      );
      plateGradient.addColorStop(0, plateColor);
      plateGradient.addColorStop(0.7, plateColor);
      plateGradient.addColorStop(1, adjustColor(plateColor, -30));
      
      ctx.fillStyle = plateGradient;
      ctx.fillRect(leftX, centerY - plateSize/2, plateSize, plateSize);
      
      // Plate border
      ctx.strokeStyle = plate === 5 ? '#000000' : '#2C3E50';
      ctx.lineWidth = 2;
      ctx.strokeRect(leftX, centerY - plateSize/2, plateSize, plateSize);
      
      // Plate text
      ctx.fillStyle = plate === 5 ? '#000000' : '#FFFFFF';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(plate.toString(), leftX + plateSize/2, centerY);
    });

    // Draw right side plates
    let rightX = barEndX + collarWidth;
    const rightPlates = plates.slice(Math.ceil(plates.length / 2));
    
    rightPlates.forEach((plate, index) => {
      const plateSize = Math.max(12, plate * 1.2);
      const plateColor = plateColors[plate as keyof typeof plateColors] || '#808080';
      
      // Plate shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(rightX + 2, centerY - plateSize/2 + 2, plateSize, plateSize);
      
      // Plate gradient
      const plateGradient = ctx.createRadialGradient(
        rightX + plateSize/2, centerY, 0,
        rightX + plateSize/2, centerY, plateSize/2
      );
      plateGradient.addColorStop(0, plateColor);
      plateGradient.addColorStop(0.7, plateColor);
      plateGradient.addColorStop(1, adjustColor(plateColor, -30));
      
      ctx.fillStyle = plateGradient;
      ctx.fillRect(rightX, centerY - plateSize/2, plateSize, plateSize);
      
      // Plate border
      ctx.strokeStyle = plate === 5 ? '#000000' : '#2C3E50';
      ctx.lineWidth = 2;
      ctx.strokeRect(rightX, centerY - plateSize/2, plateSize, plateSize);
      
      // Plate text
      ctx.fillStyle = plate === 5 ? '#000000' : '#FFFFFF';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(plate.toString(), rightX + plateSize/2, centerY);
      
      rightX += plateSize + 2;
    });

    // Draw total weight display
    const weightBoxWidth = 80;
    const weightBoxHeight = 24;
    const weightBoxX = (canvas.width - weightBoxWidth) / 2;
    const weightBoxY = canvas.height - 35;
    
    // Weight box background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(weightBoxX, weightBoxY, weightBoxWidth, weightBoxHeight);
    
    // Weight box border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(weightBoxX, weightBoxY, weightBoxWidth, weightBoxHeight);
    
    // Weight text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${weight}kg`, canvas.width/2, weightBoxY + weightBoxHeight/2);

    // Draw plate legend
    const legendY = 20;
    const legendX = 20;
    let legendOffset = 0;
    
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'left';
    
    plateSizes.forEach((size, index) => {
      const color = plateColors[size as keyof typeof plateColors] || '#808080';
      const x = legendX + (index * 45);
      
      // Legend plate
      ctx.fillStyle = color;
      ctx.fillRect(x, legendY, 12, 12);
      ctx.strokeStyle = size === 5 ? '#000000' : '#2C3E50';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, legendY, 12, 12);
      
      // Legend text
      ctx.fillStyle = size === 5 ? '#000000' : '#FFFFFF';
      ctx.font = 'bold 7px Arial';
      ctx.fillText(size.toString(), x + 6, legendY + 8);
      
      // Legend label
      ctx.fillStyle = '#333333';
      ctx.font = '8px Arial';
      ctx.fillText(`${size}kg`, x - 2, legendY + 20);
    });

  }, [weight]);

  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * amount);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="text-sm text-muted-foreground mb-3 font-semibold">
        Configuração da Barra Olímpica
      </div>
      <canvas 
        ref={canvasRef}
        className="border border-border/30 rounded-lg shadow-lg bg-white"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div className="text-xs text-muted-foreground mt-2 text-center max-w-sm">
        <div className="font-medium mb-1">Cores Padrão Olímpicas:</div>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded border border-gray-300"></div>
            <span>25kg</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded border border-gray-300"></div>
            <span>20kg</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded border border-gray-300"></div>
            <span>15kg</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded border border-gray-300"></div>
            <span>10kg</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <div className="w-3 h-3 bg-white rounded border border-gray-300"></div>
            <span>5kg</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded border border-gray-300"></div>
            <span>2.5kg</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded border border-gray-300"></div>
            <span>1.25kg</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalBarbellVisualization;
