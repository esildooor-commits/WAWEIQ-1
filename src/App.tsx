import React, { useState, useEffect, useRef } from 'react';
import { Menu, Zap, Disc, Mic, Radio, Sliders, Users, Sparkles, Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, Shuffle, Repeat } from 'lucide-react';
import { FloatingPlayer } from './components/FloatingPlayer';
import { SettingsPanel } from './components/SettingsPanel';
import { AiPanel } from './components/AiPanel';
import { Visualizer } from './components/Visualizer';
import { NavigationProvider } from './components/NavigationProvider';
import { appStore } from './store/AppStateManager';
import { AppMode } from './store/AppMode';

const apiKey = process.env.GEMINI_API_KEY || ""; 

async function callGemini(prompt: string) {
  // Dummy implementation for demo
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Das ist eine KI-Zusammenfassung für: " + prompt.substring(0, 50) + "...");
    }, 1000);
  });
}

const EQ_PRESETS = [
  { name: "Normal", levels: [50, 50, 50, 50, 50] },
  { name: "Bass Boost", levels: [90, 75, 50, 40, 35] },
  { name: "Rock", levels: [70, 60, 40, 65, 75] },
  { name: "Jazz", levels: [60, 50, 45, 55, 65] },
  { name: "Pop", levels: [45, 60, 75, 60, 50] },
  { name: "Vocal", levels: [30, 40, 85, 80, 50] },
  { name: "Electronic", levels: [80, 55, 45, 70, 85] },
  { name: "Chill", levels: [40, 45, 50, 45, 40] }
];

export default function App() {
  const [state, setState] = useState(appStore.getState());
  const [tick, setTick] = useState(0); // For force update and polling
  const [viewMode, setViewMode] = useState("carousel"); 
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => setState(appStore.getState()));
    
    // Debug polling every 500ms
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setState(appStore.getState());
    }, 500);
    
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const { activeStation, isPlaying, isLoading, appMode, equalizerSettings } = state;
  const { levels: eqLevels, activePreset } = equalizerSettings;
  const eqLabels = ["60Hz", "230Hz", "910Hz", "3kHz", "14kHz"];

  // Sleep Timer State
  const [sleepTimer, setSleepTimer] = useState(0); 
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Quality State: 'high' or 'low'
  const [streamQuality, setStreamQuality] = useState('high');

  // --- Mode Switching Logic ---
  const handleAiInsights = async (activeStation: any) => {
    setIsLoadingAi(true);
    setShowAiPanel(true);
    let prompt = "";
    if (appMode === AppMode.RADIO) prompt = `Erzähle mir kurz etwas interessantes über ${activeStation.genre} und den Track '${activeStation.nowPlaying}'. Nutze Radio-Sprache.`;
    if (appMode === AppMode.PODCAST) prompt = `Fasse super kurz zusammen, worum es im Podcast '${activeStation.name}' und speziell in der Episode '${activeStation.nowPlaying}' gehen könnte.`;
    if (appMode === AppMode.SPOTIFY) prompt = `Gib mir einen coolen Fun Fact zur Playlist '${activeStation.name}'. Was macht diesen Mix besonders?`;
    
    const result = await callGemini(prompt);
    setAiAnalysis(result as string);
    setIsLoadingAi(false);
  };

  const applyPreset = (preset: any) => {
    preset.levels.forEach((lvl: number, i: number) => appStore.updateEqualizer(i, lvl));
  };

  // Timer Logic
  useEffect(() => {
    if (sleepTimer > 0) { setTimeLeft(sleepTimer * 60); } else { setTimeLeft(null); }
  }, [sleepTimer]);

  useEffect(() => {
    if (timeLeft !== null && isPlaying) {
      if (timeLeft <= 0) {
        appStore.setIsPlaying(false);
        setTimeLeft(null);
        setSleepTimer(0);
        return;
      }
      timerRef.current = setInterval(() => { setTimeLeft(t => (t !== null ? t - 1 : null)); }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeLeft, isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`flex items-center justify-center min-h-screen bg-[#050505] font-sans text-white p-4 transition-all duration-700 ${streamQuality === 'low' ? 'sepia-[0.3] contrast-[1.1]' : ''}`}>
      
      {/* Visual Noise for Low Quality Mode */}
      {streamQuality === 'low' && isPlaying && (
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] animate-grain"></div>
      )}

      <div className="relative w-full max-w-[375px] h-[812px] bg-[#121212] rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden border-[10px] border-[#1f1f1f] flex flex-col">
        
        {/* Status Bar */}
        <div className="h-12 flex justify-between items-center px-8 pt-4 z-50">
          <div className="fixed top-0 left-0 bg-black/80 text-white p-2 text-[10px] z-[9999]">
            Station: {activeStation.name} | Status: {isLoading ? 'Loading' : isPlaying ? 'Playing' : 'Paused'}
          </div>
          <span className="text-sm font-medium">19:24</span>
          <div className="flex gap-2 items-center">
             {timeLeft !== null && <span className="text-[10px] text-orange-400 font-bold bg-orange-400/10 px-1.5 rounded-full border border-orange-400/20">{formatTime(timeLeft)}</span>}
             <div className="flex gap-0.5 items-end h-3 mr-1">
                <div className={`w-0.5 rounded-full ${streamQuality === 'low' ? 'h-1 bg-red-500' : 'h-1 bg-emerald-500'}`}></div>
                <div className={`w-0.5 rounded-full ${streamQuality === 'low' ? 'h-1.5 bg-zinc-800' : 'h-2 bg-emerald-500'}`}></div>
                <div className={`w-0.5 rounded-full ${streamQuality === 'low' ? 'h-1 bg-zinc-800' : 'h-3 bg-emerald-500'}`}></div>
             </div>
             <Zap className={`w-3 h-3 ${isPlaying ? (appMode==='spotify' ? 'text-[#1DB954] fill-[#1DB954]' : 'text-yellow-400 fill-yellow-400') : 'text-zinc-600'}`} />
             <div className="w-6 h-3 bg-white/80 rounded-[2px]" />
          </div>
        </div>

        {/* Header */}
        <header className="px-6 py-4 flex justify-between items-center z-20">
          <button onClick={() => setShowSettings(true)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <Menu className="w-5 h-5 text-zinc-300" />
          </button>
          <div className="flex flex-col items-center">
            <span className={`text-lg font-bold tracking-tight italic uppercase ${appMode === 'spotify' ? 'text-[#1DB954]' : 'text-white/90'}`}>
                Wave AI {appMode === 'spotify' && <Disc className="w-4 h-4 inline ml-1 animate-[spin_4s_linear_infinite]" />}
            </span>
            {streamQuality === 'low' && <span className="text-[7px] font-black tracking-[0.2em] text-red-500 uppercase -mt-1">Analog Signal</span>}
          </div>
          <button 
            onClick={() => setShowVisualizer(!showVisualizer)}
            className={`p-2 rounded-full transition-all border ${showVisualizer ? (appMode==='spotify' ? 'bg-[#1DB954] text-black border-[#1DB954]' : 'bg-indigo-500 text-white border-indigo-400') : 'bg-white/5 text-zinc-300 border-white/10'}`}
          >
            <Zap className="w-5 h-5" />
          </button>
        </header>

        {/* --- PILL NAVIGATION (Mode Switcher) --- */}
        <div className="px-6 mb-2 z-20 relative">
          <div className="flex bg-[#1c1c1e] p-1 rounded-full border border-white/5 shadow-inner">
            <button onClick={() => appStore.switchMode(AppMode.RADIO)} className={`flex-1 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${appMode === AppMode.RADIO ? 'bg-indigo-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Radio</button>
            <button onClick={() => appStore.switchMode(AppMode.PODCAST)} className={`flex-1 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${appMode === AppMode.PODCAST ? 'bg-purple-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Podcast</button>
            <button onClick={() => appStore.switchMode(AppMode.SPOTIFY)} className={`flex-1 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${appMode === AppMode.SPOTIFY ? 'bg-[#1DB954] text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Spotify</button>
          </div>
        </div>

        {showSettings && (
          <SettingsPanel 
            setShowSettings={setShowSettings}
            streamQuality={streamQuality}
            setStreamQuality={setStreamQuality}
            activePreset={activePreset}
            applyPreset={applyPreset}
            eqLevels={eqLevels}
            setEqLevels={(levels) => levels.forEach((lvl, i) => appStore.updateEqualizer(i, lvl))}
            setActivePreset={(preset) => {}} // Needs to be handled in AppStateManager
            eqLabels={eqLabels}
            eqPresets={EQ_PRESETS}
            sleepTimer={sleepTimer}
            setSleepTimer={setSleepTimer}
            appMode={appMode}
          />
        )}

        <AiPanel 
          showAiPanel={showAiPanel}
          setShowAiPanel={setShowAiPanel}
          isLoadingAi={isLoadingAi}
          aiAnalysis={aiAnalysis}
          appMode={appMode}
        />

        <Visualizer 
          showVisualizer={showVisualizer}
          isPlaying={isPlaying}
          activeStation={activeStation}
        />

        <NavigationProvider>
          {(currentArray, activeStation, handleStationSelect) => {
            const activeIdx = currentArray.findIndex(s => s.id === activeStation.id);
            const nextStation = () => { 
              const nextIndex = (activeIdx + 1) % currentArray.length;
              appStore.switchStation(currentArray[nextIndex]);
              setAiAnalysis("");
            };
            const prevStation = () => { 
              const prevIndex = (activeIdx - 1 + currentArray.length) % currentArray.length;
              appStore.switchStation(currentArray[prevIndex]);
              setAiAnalysis("");
            };
            return (
              <>
              <main className={`flex-1 flex flex-col pt-2 overflow-hidden transition-all duration-500 ${showAiPanel || showVisualizer || showSettings ? 'opacity-20 blur-sm scale-95' : 'opacity-100'}`}>
                <div className="px-8 mb-2 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter italic uppercase leading-none">
                      {appMode === AppMode.RADIO ? 'Live' : appMode === AppMode.PODCAST ? 'Shows' : 'Mixes'}
                    </h2>
                    <div className="flex items-center gap-2 text-zinc-500 mt-2">
                        <Users className="w-3 h-3" />
                        <p className="text-[10px] font-black uppercase tracking-widest">{activeStation.listeners} Zuhörer</p>
                    </div>
                  </div>
                  <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/5">
                    <button onClick={() => setViewMode('carousel')} className={`p-1.5 rounded-full transition-all ${viewMode === 'carousel' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>
                      <Menu className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {viewMode === 'carousel' ? (
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
                        <div key={station.id} onClick={() => handleStationSelect(index)} className="absolute transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer" style={{ transform: `translateX(${xPos}) scale(${scale})`, opacity: opacity, zIndex: zIndex }}>
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
                                <button onClick={(e) => { e.stopPropagation(); handleAiInsights(activeStation); }} className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group mt-2 ${appMode === AppMode.SPOTIFY ? 'bg-[#1DB954] text-black' : appMode === AppMode.PODCAST ? 'bg-purple-500 text-white' : 'bg-indigo-500 text-white'}`}>
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
                ) : (
                  <div className="flex-1 overflow-y-auto px-6 pt-2 pb-24 space-y-4 no-scrollbar">
                     {currentArray.map((station, index) => (
                       <div key={station.id} onClick={() => handleStationSelect(index)} className={`relative p-[1px] rounded-[2rem] cursor-pointer transition-all duration-300 ${activeIdx === index ? 'scale-[1.02]' : 'hover:scale-[1.01] opacity-60'}`}>
                          <div className="relative flex bg-[#1a1a1c] border border-white/5 rounded-[2rem] overflow-hidden h-[110px]">
                             <div className="w-[110px] shrink-0 relative">
                               <img src={station.coverUrl} alt={station.name} className="w-full h-full object-cover" />
                               {activeIdx === index && isPlaying && <div className={`absolute inset-0 backdrop-blur-[1px] flex items-center justify-center ${appMode==='SPOTIFY' ? 'bg-[#1DB954]/20' : 'bg-indigo-500/20'}`}><Zap className="w-6 h-6 text-white animate-pulse" /></div>}
                             </div>
                             <div className="p-4 flex-1 flex flex-col justify-center min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                   <span className={`text-[9px] font-black uppercase tracking-widest ${appMode === AppMode.SPOTIFY ? 'text-[#1DB954]' : appMode === AppMode.PODCAST ? 'text-purple-400' : 'text-indigo-400'}`}>{station.genre}</span>
                                   <span className="text-[9px] text-zinc-600 font-black tracking-widest">
                                     {streamQuality === 'low' ? '48 kbps Mono' : station.bitrate}
                                   </span>
                                </div>
                                <h4 className="text-base font-black truncate text-white uppercase italic">{station.name}</h4>
                                <p className="text-xs text-zinc-500 truncate mt-1">{station.host}</p>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
                )}
              </main>

              {/* --- SMART FOOTER CONTROLS --- */}
              <footer className="mt-auto px-4 pb-10 relative z-30">
                <div className="bg-[#1c1c1e] rounded-[2.5rem] p-3 shadow-2xl border border-white/5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    
                    {/* Cover & Info */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-white/10 group cursor-pointer" onClick={() => setShowVisualizer(!showVisualizer)}>
                        <img src={activeStation.coverUrl} alt="Current" className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Zap className="w-5 h-5 text-white" /></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black truncate max-w-[90px] uppercase italic tracking-tighter">{activeStation.name}</span>
                        <div className="flex items-center gap-1.5">
                           <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${streamQuality === 'low' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                           <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest truncate max-w-[70px]">
                             {streamQuality === 'low' ? 'Spar-Modus' : 'HD Stream'}
                           </span>
                        </div>
                      </div>
                    </div>

                    {/* Context-Aware Media Controls */}
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
                      {appMode === AppMode.SPOTIFY && <button className="p-2 text-zinc-500 hover:text-[#1DB954] transition-colors"><Shuffle className="w-4 h-4" /></button>}
                      
                      <button onClick={prevStation} className="p-2 text-zinc-500 hover:text-white transition-colors">
                        {appMode === AppMode.PODCAST ? <RotateCcw className="w-5 h-5" /> : <SkipBack className="w-5 h-5 fill-current" />}
                      </button>
                      
                      <button onClick={() => appStore.togglePlay()} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all ${appMode === AppMode.SPOTIFY ? 'bg-[#1DB954] text-black' : 'bg-white text-black'}`}>
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                      </button>
                      
                      <button onClick={nextStation} className="p-2 text-zinc-500 hover:text-white transition-colors">
                        {appMode === AppMode.PODCAST ? <RotateCw className="w-5 h-5" /> : <SkipForward className="w-5 h-5 fill-current" />}
                      </button>

                      {appMode === AppMode.SPOTIFY && <button className="p-2 text-zinc-500 hover:text-[#1DB954] transition-colors"><Repeat className="w-4 h-4" /></button>}
                    </div>
                  </div>

                  <div className="flex justify-around items-center pt-2 pb-1 border-t border-white/5">
                     <button onClick={() => appStore.switchMode(AppMode.RADIO)} className={`flex flex-col items-center gap-1 transition-all ${appMode === AppMode.RADIO ? 'text-indigo-400 scale-110' : 'text-zinc-600 hover:text-white'}`}>
                       <Radio className="w-5 h-5" />
                       <span className="text-[8px] font-black uppercase tracking-widest">Radio</span>
                     </button>
                     <button onClick={() => appStore.switchMode(AppMode.PODCAST)} className={`flex flex-col items-center gap-1 transition-all ${appMode === AppMode.PODCAST ? 'text-purple-400 scale-110' : 'text-zinc-600 hover:text-white'}`}>
                       <Mic className="w-5 h-5" />
                       <span className="text-[8px] font-black uppercase tracking-widest">Casts</span>
                     </button>
                     <button onClick={() => setShowSettings(true)} className="flex flex-col items-center gap-1 text-zinc-600 hover:text-white transition-colors">
                       <Sliders className="w-5 h-5" />
                       <span className="text-[8px] font-black uppercase tracking-widest">Setup</span>
                     </button>
                     <button onClick={() => appStore.switchMode(AppMode.SPOTIFY)} className={`flex flex-col items-center gap-1 transition-all ${appMode === AppMode.SPOTIFY ? 'text-[#1DB954] scale-110' : 'text-zinc-600 hover:text-white'}`}>
                       <Disc className="w-5 h-5" />
                       <span className="text-[8px] font-black uppercase tracking-widest">Spotify</span>
                     </button>
                  </div>
                </div>
              </footer>
              </>
            );
          }}
        </NavigationProvider>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-800 rounded-full" />
      </div>

      <style>{`
        @keyframes visualizer { 0%, 100% { transform: scaleY(0.2); } 50% { transform: scaleY(1); } }
        .animate-visualizer { animation: visualizer 0.6s ease-in-out infinite; transform-origin: bottom; }
        .animate-in { animation: slideIn 0.3s cubic-bezier(0.23, 1, 0.32, 1); }
        @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        .animate-grain {
          animation: grain 0.5s steps(1) infinite;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
