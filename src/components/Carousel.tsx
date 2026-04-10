import React from 'react';
import { Sparkles, Disc, Mic, Zap } from 'lucide-react';
import { AppMode } from '../store/AppMode';

interface CarouselProps {
  currentArray: any[];
  activeIdx: number;
  setActiveIdx: (idx: number) => void;
  appMode: AppMode;
  handleAiInsights: () => void;
}

export const Carousel: React.FC<CarouselProps> = ({ currentArray, activeIdx, setActiveIdx, appMode, handleAiInsights }) => {
  return (
    <div className="relative flex items-center justify-center h-[360px] w-full mt-4">
      {currentArray.map((station, index) => {
        const isActive = index === activeIdx;
        const isPrev = index === (activeIdx - 1 + currentArray.length) % currentArray.length;
        const isNext = index === (activeIdx + 1) % currentArray.length;
        if (!isActive && !isPrev && !isNext) return null;
        let xPos = "0%"; let scale = 0.8; let opacity = 0.4; let zIndex = 10;
        if (isActive) { xPos = "0%"; scale = 1; opacity = 1; zIndex = 30; }
        else if (isPrev) { xPos = "-65%"; scale = 0.85; zIndex = 20; }
        else if (isNext) { xPos = "65%"; scale = 0.85; zIndex = 20; }

        return (
          <div key={station.id} onClick={() => setActiveIdx(index)} className="absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer" style={{ transform: `translateX(${xPos}) scale(${scale})`, opacity: opacity, zIndex: zIndex }}>
            <div className={`w-[260px] h-[360px] rounded-[3rem] bg-gradient-to-br ${station.color} p-[1px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]`}>
              <div className="w-full h-full bg-[#18181b]/95 backdrop-blur-xl rounded-[2.9rem] flex flex-col overflow-hidden relative">
                <div className="relative h-[170px] w-full shrink-0">
                  <img src={station.coverUrl} alt={station.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent to-black/20"></div>
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[9px] font-black text-white uppercase border border-white/10 tracking-widest">{station.genre}</span>
                  {appMode === AppMode.SPOTIFY && <span className="absolute top-4 right-4"><Disc className="w-5 h-5 text-[#1DB954]" /></span>}
                  {appMode === AppMode.PODCAST && <span className="absolute top-4 right-4"><Mic className="w-5 h-5 text-purple-400" /></span>}
                </div>
                <div className="px-6 pt-5 pb-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-black leading-tight truncate uppercase italic">{station.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{appMode === AppMode.RADIO ? 'Host' : appMode === AppMode.PODCAST ? 'Von' : 'Kuratiert von'}: {station.host}</p>
                    <div className="mt-4 p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                       <p className={`text-[9px] font-black uppercase tracking-widest ${appMode === AppMode.SPOTIFY ? 'text-[#1DB954]' : appMode === AppMode.PODCAST ? 'text-purple-400' : 'text-indigo-400'}`}>
                         {appMode === AppMode.RADIO ? 'Jetzt On Air' : appMode === AppMode.PODCAST ? 'Neueste Folge' : 'Aktueller Track'}
                       </p>
                       <p className="text-[11px] text-white truncate font-medium">{station.nowPlaying}</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleAiInsights(); }} className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group mt-2 ${appMode === AppMode.SPOTIFY ? 'bg-[#1DB954] text-black' : appMode === AppMode.PODCAST ? 'bg-purple-500 text-white' : 'bg-indigo-500 text-white'}`}>
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {appMode === AppMode.RADIO ? 'AI DJ Talk' : appMode === AppMode.PODCAST ? 'KI Zusammenfassung' : 'Mix Insights'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
