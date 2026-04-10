import React from 'react';
import { ChevronLeft, Activity, Sliders, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsProps {
  setShowSettings: (show: boolean) => void;
  streamQuality: string;
  setStreamQuality: (q: string) => void;
  activePreset: string;
  applyPreset: (p: any) => void;
  eqLevels: number[];
  setEqLevels: (l: number[]) => void;
  setActivePreset: (p: string) => void;
  eqLabels: string[];
  eqPresets: any[];
  sleepTimer: number;
  setSleepTimer: (t: number) => void;
  appMode: string;
}

export const SettingsPanel: React.FC<SettingsProps> = ({ setShowSettings, streamQuality, setStreamQuality, activePreset, applyPreset, eqLevels, setEqLevels, setActivePreset, eqLabels, eqPresets, sleepTimer, setSleepTimer, appMode }) => {
  return (
    <div className="absolute inset-0 bg-[#0c0c0d] z-[100] p-6 animate-in slide-in-from-right duration-300 flex flex-col overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8 pt-6">
         <button onClick={() => setShowSettings(false)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Back</span>
         </button>
         <h3 className="text-lg font-black italic uppercase tracking-tighter">Studio Settings</h3>
      </div>

      {/* Quality Selector */}
      <div className="mb-8">
         <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Stream Qualität</span>
         </div>
         <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            <button onClick={() => setStreamQuality('high')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${streamQuality === 'high' ? 'bg-emerald-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <span className="text-[10px] font-black uppercase">High Fidelity (HD)</span>
            </button>
            <button onClick={() => setStreamQuality('low')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${streamQuality === 'low' ? 'bg-red-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <span className="text-[10px] font-black uppercase">Low Signal (Spar)</span>
            </button>
         </div>
      </div>

      {/* Equalizer Section */}
      <div className="mb-8">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Master Equalizer</span>
            </div>
            <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-widest">{activePreset}</span>
         </div>
         
         <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 scroll-smooth">
            {eqPresets.map((p) => (
              <button key={p.name} onClick={() => applyPreset(p)} className={`shrink-0 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all border whitespace-nowrap ${activePreset === p.name ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-white/5 text-zinc-500 border-white/5 hover:text-white hover:bg-white/10'}`}>
                {p.name}
              </button>
            ))}
         </div>

         <div className="flex justify-between items-end h-44 px-3 bg-[#161618] rounded-[2rem] p-5 border border-white/5 shadow-2xl mt-2">
            {eqLevels.map((lvl, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full group">
                 <div className="relative w-3 h-32 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        className={`absolute bottom-0 w-full ${appMode === 'spotify' ? 'bg-gradient-to-t from-[#1DB954] to-emerald-400' : 'bg-gradient-to-t from-indigo-600 to-indigo-400'}`} 
                        animate={{ height: `${lvl}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                 </div>
                 <input type="range" min="0" max="100" value={lvl} onChange={(e) => { const newLvls = [...eqLevels]; newLvls[i] = parseInt(e.target.value); setEqLevels(newLvls); setActivePreset("Custom"); }} className="w-2 h-32 opacity-0 cursor-pointer absolute z-10" />
                 <span className="text-[7px] font-black text-zinc-600 uppercase tracking-tighter">{eqLabels[i]}</span>
              </div>
            ))}
         </div>
      </div>

      {/* Sleep Timer Section */}
      <div className="mb-8">
         <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">KI Sleep Timer</span>
         </div>
         <div className="grid grid-cols-4 gap-2">
            {[0, 15, 30, 60].map((mins) => (
              <button key={mins} onClick={() => setSleepTimer(mins)} className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all border ${sleepTimer === mins ? 'bg-orange-500 border-orange-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300'}`}>
                {mins === 0 ? 'Off' : `${mins}m`}
              </button>
            ))}
         </div>
      </div>

      <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-white text-black rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all mt-auto">
        Save & Apply
      </button>
    </div>
  );
};
