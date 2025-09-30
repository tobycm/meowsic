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

    const albumArt = song.albumArt() || "/default-album-art.png";

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title || song.name,
      artist: song.artist || "Unknown Artist",
      album: "",
      artwork: [
        { src: albumArt, sizes: "96x96", type: "image/png" },
        { src: albumArt, sizes: "128x128", type: "image/png" },
        { src: albumArt, sizes: "192x192", type: "image/png" },
        { src: albumArt, sizes: "256x256", type: "image/png" },
        { src: albumArt, sizes: "384x384", type: "image/png" },
        { src: albumArt, sizes: "512x512", type: "image/png" },
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
