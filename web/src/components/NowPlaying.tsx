import { Image, Skeleton, Stack } from "@mantine/core";
import { useShallow } from "zustand/shallow";
import { useNowPlaying } from "../states/NowPlaying";
import AudioControls from "./AudioControls";

export default function NowPlaying() {
  const song = useNowPlaying(useShallow((state) => state.song));

  return (
    <Stack gap="md" p="md">
      {song ? (
        <Image src={song.albumArt} alt={`${song.title} by ${song.artist}`} bdrs="xl" h="auto" w="45vw" style={{ aspectRatio: 16 / 9 }} />
      ) : (
        <Skeleton h="calc(45vw/16*9)" w="45vw" bdrs="xl" />
      )}

      <AudioControls />
    </Stack>
  );
}
