/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import ReactPlayer from "react-player";
import type { Song } from "../lib/api";

// The interface defines the "API" for our context
export interface AudioContextInterface {
  state: {
    song?: Song;
    playing: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    playbackRate: number;
    loop: boolean;
    muted: boolean;
  };
  load: (song: Song, autoplay?: boolean) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setLoop: (loop: boolean) => void;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
}

const AudioContext = createContext<AudioContextInterface | undefined>(undefined);

export default function AudioProvider({ children }: { children: ReactNode }) {
  const initialState = {
    song: undefined,
    playing: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    muted: false,
    volume: 0.5,
  };

  type PlayerState = Omit<typeof initialState, "song"> & {
    song?: Song;
  };

  const [state, setState] = useState<PlayerState>(initialState);

  // Create a ref to get access to ReactPlayer's internal methods
  const playerRef = useRef<HTMLVideoElement>(null);

  // Assemble the value to be passed to consumers of the context
  const contextValue = {
    state: {
      song: state.song,
      playing: state.playing,
      currentTime: state.currentTime,
      duration: state.duration,
      volume: state.volume,
      playbackRate: state.playbackRate,
      loop: state.loop,
      muted: state.muted,
    },
    load: (newSong: Song, autoplay = false) => {
      setState((prevState) => ({
        ...prevState,
        song: newSong,
        playing: autoplay,
        currentTime: 0,
        duration: 0,
      }));
    },
    play: () => {
      if (!state.song) return;

      setState((prevState) => ({
        ...prevState,
        playing: true,
      }));
    },
    pause: () => {
      setState((prevState) => ({
        ...prevState,
        playing: false,
      }));
    },
    seek: (time: number) => {
      if (!playerRef.current) return;
      playerRef.current.currentTime = time;
      setState((prevState) => ({
        ...prevState,
        currentTime: time,
      }));
    },
    setVolume: (volume: number) => {
      setState((prevState) => ({
        ...prevState,
        volume: volume,
      }));
      if (playerRef.current) {
        playerRef.current.volume = volume;
      }
    },
    setPlaybackRate: (rate: number) => {
      setState((prevState) => ({
        ...prevState,
        playbackRate: rate,
      }));
      if (playerRef.current) {
        playerRef.current.playbackRate = rate;
      }
    },
    setLoop: (loop: boolean) => {
      setState((prevState) => ({
        ...prevState,
        loop: loop,
      }));
    },
    setMuted: (muted: boolean) => {
      setState((prevState) => ({
        ...prevState,
        muted: muted,
      }));
      if (playerRef.current) {
        playerRef.current.muted = muted;
      }
    },
    toggleMuted: () => {
      setState((prevState) => ({
        ...prevState,
        muted: !prevState.muted,
      }));
      if (playerRef.current) {
        playerRef.current.muted = !state.muted;
      }
    },
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}

      {/* This hidden ReactPlayer component does all the actual audio work.
        It listens to our state (`playing`, `volume`, etc.) and plays the audio.
      */}
      <ReactPlayer
        ref={playerRef}
        src={state.song?.src}
        playing={state.playing}
        volume={state.volume}
        playbackRate={state.playbackRate}
        loop={state.loop}
        muted={state.muted}
        controls={false}
        onTimeUpdate={() => {
          if (!playerRef.current) return;
          const currentTime = playerRef.current.currentTime;
          setState((prevState) => ({
            ...prevState,
            currentTime,
          }));
        }}
        onProgress={() => {
          if (!playerRef.current) return;
          const currentTime = playerRef.current.currentTime;
          setState((prevState) => ({
            ...prevState,
            currentTime,
          }));
        }}
        onDurationChange={() => {
          if (!playerRef.current) return;
          const duration = playerRef.current.duration;

          setState((prevState) => ({
            ...prevState,
            duration,
          }));
        }}
        onEnded={() =>
          setState((prevState) => ({
            ...prevState,
            playing: false,
            currentTime: 0,
          }))
        }
        onError={(e) => console.error("ReactPlayer Error", e)}
        style={{ display: "none" }}
      />
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
}
