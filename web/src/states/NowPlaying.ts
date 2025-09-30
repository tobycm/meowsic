import { uuidv7 } from "@kripod/uuidv7";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Song } from "../lib/api";
import { shuffleArray } from "../lib/utils";

type LoopMode = "off" | "one" | "all";

const initial = {
  song: undefined,
  songId: undefined as number | undefined,
  playing: false,
  currentTime: 0,
  seekTo: 0,
  duration: 0,
  playbackRate: 1.0,
  seeking: false,
  loop: "off" as LoopMode,
  shuffle: false,
  muted: false,
  volume: 0.5,

  songs: [] as Song[],

  shuffled: [] as Song[],

  seed: undefined as string | undefined,
};

type PlayerState = Omit<typeof initial, "song"> & {
  song?: Song;
} & {
  load: (id?: number, autoplay?: boolean) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setLoop: (loop: LoopMode) => void;
  toggleLoop: () => void;
  setShuffle: (shuffle: boolean, doShuffle?: boolean) => void;
  toggleShuffle: (doShuffle?: boolean) => void;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;

  shuffleSongs: (songs?: Song[]) => void;

  setSongs: (songs: Song[]) => void;
  setShuffled: (shuffled: Song[]) => void;

  setSeed: (seed?: string) => void;

  previous: () => void;
  next: () => void;

  loadRandom: () => void;
};

export const useNowPlaying = create<PlayerState>()(
  persist(
    (set, get) => ({
      ...initial,
      load(id?: number, autoplay = false) {
        const { songs, shuffle, shuffled } = get();

        const song = id ? (shuffle ? shuffled : songs).find((s) => s.id === id) : songs[0];
        console.log("Loading song", { id, song, songs, shuffled });

        if (!song) return;

        set({ song, playing: autoplay, currentTime: 0, duration: 0 });
      },
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

      setShuffle(shuffle: boolean, doShuffle?: boolean) {
        if (shuffle && doShuffle) {
          const { songs } = get();
          set({ shuffled: shuffleArray(songs) });
        }

        set({ shuffle });
      },
      toggleShuffle(doShuffle?: boolean) {
        const { shuffle } = get();

        if (!shuffle && doShuffle) {
          const { songs } = get();
          const seed = uuidv7();
          set({ shuffled: shuffleArray(songs, seed), seed });
        }

        set({ shuffle: !shuffle });
      },

      setMuted: (muted: boolean) => set({ muted }),
      toggleMuted: () => set((state) => ({ muted: !state.muted })),

      setCurrentTime: (time: number) => set({ currentTime: time }),
      setDuration: (duration: number) => set({ duration: duration }),

      setSongs: (songs: Song[]) => set({ songs }),
      setShuffled: (shuffled: Song[]) => set({ shuffled }),

      shuffleSongs(songs?: Song[]) {
        if (!songs) {
          songs = get().songs;
        }
        set({ shuffled: shuffleArray(songs, get().seed) });
      },

      setSeed: (seed?: string) => set({ seed }),

      previous() {
        const { songs, shuffled, song, shuffle, loop, load } = get();
        if (!song) return;

        const list = shuffle ? shuffled : songs;
        const index = list.findIndex((s) => s.id === song.id);
        if (index === -1) return;

        const prevIndex = index - 1 < 0 ? (loop === "all" ? list.length - 1 : -1) : index - 1;
        if (prevIndex === -1) return;

        const prevSong = list[prevIndex];
        if (!prevSong) return;

        load(prevSong.id, true);
      },
      next() {
        const { songs, shuffled, song, shuffle, loop, load } = get();
        if (!song) return;

        const list = shuffle ? shuffled : songs;
        const index = list.findIndex((s) => s.id === song.id);
        if (index === -1) return;

        const nextIndex = index + 1 >= list.length ? (loop === "all" ? 0 : -1) : index + 1;
        if (nextIndex === -1) return;

        const nextSong = list[nextIndex];
        if (!nextSong) return;

        load(nextSong.id, true);
      },

      loadRandom() {
        const { songs, load } = get();
        if (songs.length === 0) return;

        const song = songs[Math.floor(Math.random() * songs.length)];
        load(song.id, true);
      },
    }),
    {
      name: "now-playing-storage",
      partialize: (state) => ({
        volume: state.volume,
        muted: state.muted,
        loop: state.loop,
        shuffle: state.shuffle,
        playbackRate: state.playbackRate,

        currentTime: state.currentTime,
        songId: state.song?.id,

        seed: state.seed,
      }),
    }
  )
);
