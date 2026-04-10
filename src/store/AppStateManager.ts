import { DEFAULT_EQUALIZER_SETTINGS, DEFAULT_APP_MODE } from '../constants/appDefaults';
import { AppMode } from './AppMode';
import { RADIO_STATIONS } from '../constants/radioStations';

export { AppMode };

export interface Station {
  id: number;
  name: string;
  host: string;
  genre: string;
  coverUrl: string;
  bitrate: string;
  streamUrl: string;
  color: string;
  nowPlaying: string;
  listeners: string;
}

export interface AppState {
  activeStation: Station;
  isPlaying: boolean;
  isLoading: boolean;
  appMode: AppMode;
  isAiPanelOpen: boolean;
  equalizerSettings: {
    levels: number[];
    activePreset: string;
  };
}

// ZUKUNFTSSICHERHEIT:
// In Android Studio wird diese Logik als ViewModel implementiert.
// Anstelle von `subscribe` und `notify` werden dort `StateFlow` oder `LiveData`
// verwendet, um den Zustand reaktiv an die UI (Jetpack Compose) zu binden.
// Dies simuliert den asynchronen Verbindungsaufbau zum ExoPlayer. 
// In der Android-Implementierung wird dieser Status direkt aus dem Player.Listener 
// (onPlaybackStateChanged) bezogen, wenn der STATE_BUFFERING erreicht wird.

class AppStateManager {
  private state: AppState;
  private listeners: (() => void)[] = [];

  constructor(initialState: AppState) {
    const savedMode = localStorage.getItem('waveiq_app_mode') as AppMode | null;
    if (savedMode) {
      initialState.appMode = savedMode;
    }
    this.state = initialState;
  }

  // ZUKUNFTSSICHERHEIT:
  // Diese Navigation entspricht dem NavHost in Jetpack Compose.
  // Jeder Modus (Radio, Podcast, Spotify) wird in Android eine eigene 
  // Composable Route sein, die über das ViewModel gesteuert wird.

  getState(): AppState {
    return this.state;
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  togglePlay() {
    this.state.isPlaying = !this.state.isPlaying;
    this.state.isLoading = false;
    this.notify();
  }

  setIsPlaying(playing: boolean) {
    this.state.isPlaying = playing;
    this.state.isLoading = false;
    this.notify();
  }

  connectToStream(url: string) {
    this.state.isLoading = true;
    this.state.isPlaying = false;
    this.notify();

    setTimeout(() => {
      this.state.isLoading = false;
      this.state.isPlaying = true;
      this.notify();
    }, 1500);
  }

  switchStation(newStation: Station) {
    this.state.activeStation = newStation;
    this.connectToStream(newStation.streamUrl);
  }

  switchMode(mode: AppMode) {
    this.state.appMode = mode;
    localStorage.setItem('waveiq_app_mode', mode);
    this.notify();
  }

  updateEqualizer(bandIndex: number, value: number) {
    this.state.equalizerSettings.levels[bandIndex] = value;
    this.state.equalizerSettings.activePreset = "Custom";
    this.notify();
  }
  
  setAiPanelOpen(isOpen: boolean) {
    this.state.isAiPanelOpen = isOpen;
    this.notify();
  }
}

// Exportiere eine Instanz (Singleton)
export const appStore = new AppStateManager({
  activeStation: RADIO_STATIONS[0],
  isPlaying: false,
  isLoading: false,
  appMode: DEFAULT_APP_MODE,
  isAiPanelOpen: false,
  equalizerSettings: DEFAULT_EQUALIZER_SETTINGS
});
