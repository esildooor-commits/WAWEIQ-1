import React from 'react';
import { Radio, Mic, Disc, Sliders } from 'lucide-react';

interface TabSelectorProps {
  appMode: string;
  setAppMode: (mode: string) => void;
  setShowSettings: (show: boolean) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ appMode, setAppMode, setShowSettings }) => {
  return (
    <div className="flex justify-around items-center pt-2 pb-1 border-t border-white/5">
       <button onClick={() => setAppMode('radio')} className={`flex flex-col items-center gap-1 transition-all ${appMode === 'radio' ? 'text-indigo-400 scale-110' : 'text-zinc-600 hover:text-white'}`}>
         <Radio className="w-5 h-5" />
         <span className="text-[8px] font-black uppercase tracking-widest">Radio</span>
       </button>
       <button onClick={() => setAppMode('podcast')} className={`flex flex-col items-center gap-1 transition-all ${appMode === 'podcast' ? 'text-purple-400 scale-110' : 'text-zinc-600 hover:text-white'}`}>
         <Mic className="w-5 h-5" />
         <span className="text-[8px] font-black uppercase tracking-widest">Casts</span>
       </button>
       <button onClick={() => setShowSettings(true)} className="flex flex-col items-center gap-1 text-zinc-600 hover:text-white transition-colors">
         <Sliders className="w-5 h-5" />
         <span className="text-[8px] font-black uppercase tracking-widest">Setup</span>
       </button>
       <button onClick={() => setAppMode('spotify')} className={`flex flex-col items-center gap-1 transition-all ${appMode === 'spotify' ? 'text-[#1DB954] scale-110' : 'text-zinc-600 hover:text-white'}`}>
         <Disc className="w-5 h-5" />
         <span className="text-[8px] font-black uppercase tracking-widest">Spotify</span>
       </button>
    </div>
  );
};
