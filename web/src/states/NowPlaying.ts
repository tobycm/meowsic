import { create } from "zustand";
import type { Song } from "../lib/api";

type LoopMode = "off" | "one" | "all";

const initial = {
  song: undefined,
  playing: false,
  currentTime: 0,
  seekTo: 0,
  duration: 0,
  playbackRate: 1.0,
  seeking: false,
  loop: "off",
  shuffle: false,
  muted: false,
  volume: 0.5,
};

type PlayerState = Omit<typeof initial, "song"> & {
  song?: Song;
} & {
  load: (song: Song, autoplay?: boolean) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setLoop: (loop: LoopMode) => void;
  toggleLoop: () => void;
  setShuffle: (shuffle: boolean) => void;
  toggleShuffle: () => void;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
};

export const useNowPlaying = create<PlayerState>((set) => ({
  ...initial,
  load: (song: Song, autoplay = false) => set({ song, playing: autoplay, currentTime: 0, duration: 0 }),

  play: () => set({ playing: true }),
  pause: () => set({ playing: false }),
  togglePlay: () => set((state) => ({ playing: !state.playing })),

  seek: (time: number) => set(() => ({ seekTo: time })),

  setVolume: (volume: number) => set({ volume }),

  setPlaybackRate: (rate: number) => set({ playbackRate: rate }),

  setLoop: (loop: LoopMode) => set({ loop }),
  toggleLoop: () =>
    set((state) => {
      if (state.loop === "off") return { loop: "all" };
      if (state.loop === "all") return { loop: "one" };
      return { loop: "off" };
    }),

  setShuffle: (shuffle: boolean) => set({ shuffle }),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

  setMuted: (muted: boolean) => set({ muted }),
  toggleMuted: () => set((state) => ({ muted: !state.muted })),

  setCurrentTime: (time: number) => set({ currentTime: time }),
  setDuration: (duration: number) => set({ duration: duration }),
}));
