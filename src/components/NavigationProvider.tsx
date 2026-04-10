import React, { useState, useEffect } from 'react';
import { appStore } from '../store/AppStateManager';
import { AppMode } from '../store/AppMode';
import { RADIO_STATIONS, PODCASTS, SPOTIFY } from '../constants/radioStations';

interface NavigationProviderProps {
  children: (currentArray: any[], activeStation: any, handleStationSelect: (index: number) => void) => React.ReactNode;
}

// ZUKUNFTSSICHERHEIT:
// Diese Navigation entspricht dem NavHost in Jetpack Compose.
// Jeder Modus (Radio, Podcast, Spotify) wird in Android eine eigene 
// Composable Route sein, die über das ViewModel gesteuert wird.

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [state, setState] = useState(appStore.getState());

  useEffect(() => {
    return appStore.subscribe(() => setState(appStore.getState()));
  }, []);

  const { appMode, activeStation } = state;

  let currentArray = RADIO_STATIONS;
  if (appMode === AppMode.PODCAST) currentArray = PODCASTS;
  else if (appMode === AppMode.SPOTIFY) currentArray = SPOTIFY;

  const handleStationSelect = (index: number) => {
    appStore.switchStation(currentArray[index]);
  };

  return <>{children(currentArray, activeStation, handleStationSelect)}</>;
};
