import { createContext, useContext } from "react";
import type { MeowsicAPI } from "../lib/api";

export interface AppContextInterface {
  api: MeowsicAPI;
}

const AppContext = createContext<AppContextInterface | undefined>(undefined);

export default function AppProvider({ children, api }: { children: React.ReactNode; api: MeowsicAPI }) {
  return <AppContext.Provider value={{ api }}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}
