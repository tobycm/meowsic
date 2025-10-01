import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useNowPlaying } from "../states/NowPlaying";

export default function Hotkeys() {
  const { togglePlay, previous, next, seek, toggleMute, setVolume } = useNowPlaying(
    useShallow((state) => ({
      togglePlay: state.togglePlay,
      toggleMute: state.toggleMute,
      setVolume: state.setVolume,
      previous: state.previous,
      next: state.next,
      seek: state.seek,
    }))
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.target?.tagName === "INPUT" || event.target?.tagName === "TEXTAREA") {
        return;
      }

      const { currentTime, volume } = useNowPlaying.getState();

      switch (event.key) {
        case " ":
          event.preventDefault();
          togglePlay();
          break;

        case "n":
          next();
          break;
        case "N":
          next();
          break;
        case "p":
          previous();
          break;
        case "P":
          previous();
          break;

        case "m":
          toggleMute();
          break;

        case "ArrowRight":
          seek(currentTime + 5);
          break;

        case "ArrowLeft":
          seek(currentTime - 5);
          break;

        case "ArrowUp":
          setVolume(Math.min(1, volume + 0.02));
          break;

        case "ArrowDown":
          setVolume(Math.max(0, volume - 0.02));
          break;

        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlay, next, previous, seek]);

  return null;
}
