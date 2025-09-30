import { create } from "zustand";
import { persist } from "zustand/middleware";

const initial = {
  dominantColor: "",
};

type AppState = typeof initial & {
  setDominantColor: (color: string) => void;
};

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      ...initial,
      setDominantColor: (color: string) => set({ dominantColor: color }),
    }),
    {
      name: "meowsic-storage",
      partialize: (state) => ({
        dominantColor: state.dominantColor,
      }),
    }
  )
);
