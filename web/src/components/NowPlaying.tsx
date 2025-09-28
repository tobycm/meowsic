import { Image, Skeleton, Stack, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useShallow } from "zustand/shallow";
import { useNowPlaying } from "../states/NowPlaying";
import AudioControls from "./AudioControls";

export default function NowPlaying() {
  const theme = useMantineTheme();

  const isMobile = useMediaQuery("(max-width: 56rem)");

  const song = useNowPlaying(useShallow((state) => state.song));

  return (
    <Stack gap="md" p="md">
      <Skeleton h="calc(45vw/16*9)" w={isMobile ? "90vw" : "45vw"} bdrs="xl" visible={false} style={{ boxShadow: theme.shadows.lg }}>
        {song && <Image src={song.albumArt()} alt={`${song.title} by ${song.artist}`} bdrs="xl" h="auto" w="100%" style={{ aspectRatio: 16 / 9 }} />}
      </Skeleton>
      <AudioControls />
    </Stack>
  );
}
