import { Box, Image } from "@mantine/core";
import ColorThief from "colorthief";
import { setLightness } from "polished";
import { useRef } from "react";
import { useShallow } from "zustand/shallow";
import { useNowPlaying } from "../states/NowPlaying";

export default function NowPlayingBackground() {
  const song = useNowPlaying(useShallow((state) => state.song));
  const setDominantColor = useNowPlaying(useShallow((state) => state.setDominantColor));

  const imgRef = useRef<HTMLImageElement>(null);

  if (!song)
    return <Box maw="100vw" miw="100vw" mah="100vh" mih="100vh" pos="absolute" bg="vgrey" m={0} p={0} style={{ overflow: "hidden", zIndex: -1 }} />;

  function handleImageLoad() {
    const img = imgRef.current;

    if (!img) return;

    if (!img.complete) return;

    const colorThief = new ColorThief();

    const color = colorThief.getColor(img, 20);

    const light = setLightness(0.7, `rgb(${color[0]}, ${color[1]}, ${color[2]})`);

    setDominantColor(light);
  }

  return (
    <Box maw="100vw" miw="100vw" mah="100vh" mih="100vh" pos="absolute" m={0} p={0} style={{ overflow: "hidden", zIndex: -1 }}>
      <Image
        h="calc(100% + 128px)"
        w="calc(100% + 128px)"
        src={song.albumArt({ width: 480 })}
        alt={`${song.title} by ${song.artist}`}
        bgr="no-repeat"
        bgsz="cover"
        style={{
          position: "absolute",
          top: "-64px",
          left: "-64px",
          filter: "blur(24px)",
        }}
        crossOrigin="anonymous"
        ref={imgRef}
        onLoad={handleImageLoad}
      />
    </Box>
  );
}
