import { Box, Image } from "@mantine/core";
import { useShallow } from "zustand/shallow";
import { useNowPlaying } from "../states/NowPlaying";

export default function NowPlayingBackground() {
  const song = useNowPlaying(useShallow((state) => state.song));

  if (!song)
    return <Box maw="100vw" miw="100vw" mah="100vh" mih="100vh" pos="absolute" bg="vgrey" m={0} p={0} style={{ overflow: "hidden", zIndex: -1 }} />;

  return (
    <Box maw="100vw" miw="100vw" mah="100vh" mih="100vh" pos="absolute" m={0} p={0} style={{ overflow: "hidden", zIndex: -1 }}>
      <Image
        h="calc(100% + 128px)"
        w="calc(100% + 128px)"
        src={song.albumArt()}
        alt={`${song.title} by ${song.artist}`}
        bgr="no-repeat"
        bgsz="cover"
        style={{
          position: "absolute",
          top: "-64px",
          left: "-64px",
          filter: "blur(24px)",
        }}
      />
    </Box>
  );
}
