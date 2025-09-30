import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useNowPlaying } from "../states/NowPlaying";

export default function MediaSession() {
  const { pause, play, setCurrentTime } = useNowPlaying(
    useShallow((state) => ({
      play: state.play,
      pause: state.pause,
      setCurrentTime: state.setCurrentTime,
    }))
  );

  const song = useNowPlaying(useShallow((state) => state.song));
  const playing = useNowPlaying((state) => state.playing);
  const duration = useNowPlaying((state) => state.duration);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    if (!song) {
      navigator.mediaSession.metadata = null;
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title || song.name,
      artist: song.artist || "Unknown Artist",
      album: "",
      artwork: [
        { src: song.albumArt({ height: 60 }), sizes: "60x60", type: "image/png" },
        { src: song.albumArt({ height: 80 }), sizes: "80x80", type: "image/png" },
        { src: song.albumArt({ height: 160 }), sizes: "160x160", type: "image/png" },
        { src: song.albumArt({ height: 240 }), sizes: "240x240", type: "image/png" },
        { src: song.albumArt({ height: 320 }), sizes: "320x320", type: "image/png" },
        { src: song.albumArt({ height: 480 }), sizes: "480x480", type: "image/png" },
      ],
    });

    console.log("Updated Media Session metadata", navigator.mediaSession.metadata);
  }, [song]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }, [playing]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("play", () => {
      play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      pause();
    });
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime !== undefined) {
        setCurrentTime(details.seekTime);
      }
    });
    navigator.mediaSession.setActionHandler("stop", () => {
      pause();
      setCurrentTime(duration);
    });

    return () => {
      if (!("mediaSession" in navigator)) return;

      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("seekto", null);
      navigator.mediaSession.setActionHandler("stop", null);
    };
  }, [play, pause, setCurrentTime, duration]);

  return null;
}
