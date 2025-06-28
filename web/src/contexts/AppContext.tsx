import { createContext, useContext, useState } from "react";
import type { MeowsicAPI, Song } from "../lib/api";

export interface AppContextInterface {
  api: MeowsicAPI;

  nowPlaying?: {
    song: Song;

    progress: number; // Progress in seconds
    isPlaying: boolean;
  };

  setNowPlaying: (nowPlaying: AppContextInterface["nowPlaying"]) => void;
}

const AppContext = createContext<AppContextInterface | undefined>(undefined);

export default function AppProvider({ children, api }: { children: React.ReactNode; api: MeowsicAPI }) {
  const [nowPlaying, setNowPlaying] = useState<AppContextInterface["nowPlaying"]>(undefined);

  return (
    <AppContext.Provider
      value={{
        api,
        nowPlaying,
        setNowPlaying,
      }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}
