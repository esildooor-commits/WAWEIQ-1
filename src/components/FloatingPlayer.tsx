import React from 'react';
import { Play, Pause, Zap, Shuffle, Repeat, SkipBack, SkipForward, RotateCcw, RotateCw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { AppMode } from '../store/AppMode';

interface PlayerProps {
  activeStation: any;
  isPlaying: boolean;
  isLoading: boolean;
  setIsPlaying: (playing: boolean) => void;
  appMode: AppMode;
  prevStation: () => void;
  nextStation: () => void;
  setShowVisualizer: (show: boolean) => void;
}

const VisualizerBars = ({ isPlaying }: { isPlaying: boolean }) => (
  <div className="flex items-end gap-0.5 h-3">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className={`w-1 rounded-full ${isPlaying ? 'bg-white' : 'bg-zinc-600'}`}
        animate={isPlaying ? { height: [4, 12, 6, 12, 4] } : { height: 4 }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
      />
    ))}
  </div>
);

export const FloatingPlayer: React.FC<PlayerProps> = ({ activeStation, isPlaying, isLoading, setIsPlaying, appMode, prevStation, nextStation, setShowVisualizer }) => {
  return (
    <footer className="mt-auto px-4 pb-10 relative z-30">
      <div className="bg-[#1c1c1e] rounded-[2.5rem] p-3 shadow-2xl border border-white/5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-white/10 group cursor-pointer" onClick={() => setShowVisualizer(true)}>
              <img src={activeStation.cover} alt="Current" className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'scale-110 animate-pulse' : 'scale-100'}`} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Zap className="w-5 h-5 text-white" /></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black truncate max-w-[90px] uppercase italic tracking-tighter">{activeStation.name}</span>
              <div className="flex items-center gap-2">
                 <VisualizerBars isPlaying={isPlaying} />
                 <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest truncate max-w-[70px]">
                   {isLoading ? 'Connecting...' : isPlaying ? 'Live' : 'Paused'}
                 </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
            {appMode === AppMode.SPOTIFY && <button className="p-2 text-zinc-500 hover:text-[#1DB954] transition-colors"><Shuffle className="w-4 h-4" /></button>}
            <button onClick={prevStation} className="p-2 text-zinc-500 hover:text-white transition-colors">
              {appMode === AppMode.PODCAST ? <RotateCcw className="w-5 h-5" /> : <SkipBack className="w-5 h-5 fill-current" />}
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all ${appMode === AppMode.SPOTIFY ? 'bg-[#1DB954] text-black' : 'bg-white text-black'}`}>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Loader2 className="w-6 h-6 animate-spin" /></motion.div>
                ) : isPlaying ? (
                  <motion.div key="pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Pause className="w-6 h-6 fill-current" /></motion.div>
                ) : (
                  <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Play className="w-6 h-6 fill-current ml-0.5" /></motion.div>
                )}
              </AnimatePresence>
            </button>
            <button onClick={nextStation} className="p-2 text-zinc-500 hover:text-white transition-colors">
              {appMode === AppMode.PODCAST ? <RotateCw className="w-5 h-5" /> : <SkipForward className="w-5 h-5 fill-current" />}
            </button>
            {appMode === AppMode.SPOTIFY && <button className="p-2 text-zinc-500 hover:text-[#1DB954] transition-colors"><Repeat className="w-4 h-4" /></button>}
          </div>
        </div>
      </div>
    </footer>
  );
};
