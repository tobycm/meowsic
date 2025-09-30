import { useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useShallow } from "zustand/shallow";
import { useNowPlaying } from "../states/NowPlaying";

export default function Player() {
  const { pause, setCurrentTime, setDuration, next } = useNowPlaying(
    useShallow((state) => ({
      pause: state.pause,
      next: state.next,
      setCurrentTime: state.setCurrentTime,
      setDuration: state.setDuration,
    }))
  );

  const song = useNowPlaying(useShallow((state) => state.song));
  const playing = useNowPlaying((state) => state.playing);
  const seekTo = useNowPlaying((state) => state.seekTo);
  const duration = useNowPlaying((state) => state.duration);
  const volume = useNowPlaying((state) => state.volume);
  const playbackRate = useNowPlaying((state) => state.playbackRate);
  const loop = useNowPlaying((state) => state.loop);
  const muted = useNowPlaying((state) => state.muted);

  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!playerRef.current) return;

    playerRef.current.currentTime = seekTo;
  }, [seekTo]);

  return (
    <ReactPlayer
      ref={playerRef}
      src={song?.src}
      playing={playing}
      volume={volume}
      playbackRate={playbackRate}
      loop={loop === "one"}
      muted={muted}
      controls={false}
      onTimeUpdate={() => {
        if (!playerRef.current) return;
        setCurrentTime(playerRef.current.currentTime);
      }}
      onProgress={() => {
        if (!playerRef.current) return;
        setCurrentTime(playerRef.current.currentTime);
      }}
      onDurationChange={() => {
        if (!playerRef.current) return;
        setDuration(playerRef.current.duration);
      }}
      onEnded={() => {
        if (loop === "all") {
          next();
          return;
        }

        pause();
        setCurrentTime(duration);
      }}
      onError={(e) => console.error("ReactPlayer Error", e)}
      style={{ display: "none" }}
    />
  );
}
