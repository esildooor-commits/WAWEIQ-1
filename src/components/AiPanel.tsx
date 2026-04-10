import React from 'react';
import { Mic2, Loader2 } from 'lucide-react';

interface AiPanelProps {
  showAiPanel: boolean;
  setShowAiPanel: (show: boolean) => void;
  isLoadingAi: boolean;
  aiAnalysis: string;
  appMode: string;
}

export const AiPanel: React.FC<AiPanelProps> = ({ showAiPanel, setShowAiPanel, isLoadingAi, aiAnalysis, appMode }) => {
  if (!showAiPanel) return null;
  return (
    <div className="absolute inset-x-0 top-24 mx-4 z-50 animate-in slide-in-from-top-4 duration-300">
      <div className={`bg-[#1c1c1e]/95 backdrop-blur-xl border rounded-2xl p-4 shadow-2xl ${appMode === 'spotify' ? 'border-[#1DB954]/30' : appMode === 'podcast' ? 'border-purple-500/30' : 'border-indigo-500/30'}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-lg animate-pulse ${appMode === 'spotify' ? 'bg-[#1DB954]' : appMode === 'podcast' ? 'bg-purple-500' : 'bg-indigo-500'}`}>
              <Mic2 className={`w-4 h-4 ${appMode === 'spotify' ? 'text-black' : 'text-white'}`} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-tighter ${appMode === 'spotify' ? 'text-[#1DB954]' : appMode === 'podcast' ? 'text-purple-400' : 'text-indigo-400'}`}>
              {appMode === 'radio' ? 'Wave-AI DJ' : appMode === 'podcast' ? 'AI Summary' : 'Spotify Insights'}
            </span>
          </div>
          <button onClick={() => setShowAiPanel(false)} className="text-zinc-500 text-xs hover:text-white">✕</button>
        </div>
        {isLoadingAi ? (
          <div className="flex items-center gap-3 py-4">
            <Loader2 className={`w-5 h-5 animate-spin ${appMode === 'spotify' ? 'text-[#1DB954]' : 'text-indigo-500'}`} />
            <p className="text-sm text-zinc-400 italic font-medium">Generiere Insights...</p>
          </div>
        ) : (
          <p className="text-sm text-zinc-200 leading-relaxed italic">"{aiAnalysis}"</p>
        )}
      </div>
    </div>
  );
};
