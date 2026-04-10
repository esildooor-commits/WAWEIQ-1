import React from 'react';
import { Zap } from 'lucide-react';

interface VisualizerProps {
  showVisualizer: boolean;
  isPlaying: boolean;
  activeStation: any;
}

export const Visualizer: React.FC<VisualizerProps> = ({ showVisualizer, isPlaying, activeStation }) => {
  if (!showVisualizer || !isPlaying) return null;
  return (
    <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm pointer-events-none flex items-center justify-center">
      <div className="flex items-end gap-1.5 h-64">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`w-3.5 bg-gradient-to-t ${activeStation.color} rounded-full animate-visualizer`} style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100}%` }}></div>
        ))}
      </div>
    </div>
  );
};
