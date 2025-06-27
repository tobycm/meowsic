import { createContext, useContext } from "react";
import type { APIClient } from "../lib/api";

export interface AppContextInterface {
  api: APIClient;
}

const AppContext = createContext<AppContextInterface | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}

export default AppContext;
