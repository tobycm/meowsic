import { Center, Loader, ScrollArea, Stack, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../contexts/AppContext";
import { Song } from "../lib/api";
import { useNowPlaying } from "../states/NowPlaying";
import SongCard from "./SongCard";

export default function SongsList() {
  const { api } = useAppContext();

  const theme = useMantineTheme();

  const isMobile = useMediaQuery("(max-width: 48rem)");

  const songs = useQuery({
    queryKey: ["songs", ["sort", "name"], ["order", "asc"], ["limit", 0]],

    queryFn: async () => {
      const songs = await api.songs({
        sort: "name",
        order: "asc",
        limit: 0,
      });

      return songs.map(
        (song) =>
          new Song({
            id: song.id,
            name: song.name,
            title: song.title,
            artist: song.artist,
            duration: song.duration,
          })
      );
    },
  });

  const nowPlayingId = useNowPlaying((state) => state.song?.id);
  const playing = useNowPlaying((state) => state.playing);

  return (
    <ScrollArea
      h={isMobile ? "40vh" : "60vh"}
      w={isMobile ? "90%" : "42vw"}
      bdrs="xl"
      bg="#FFFFFF3F"
      style={{ boxShadow: theme.shadows.lg, backdropFilter: "blur(24px)" }}>
      <Stack gap="md" p="md">
        {!songs.isFetched && (
          <Center mt="xl">
            <Loader size="xl" />
          </Center>
        )}

        {songs.isFetched &&
          !!songs.data &&
          songs.data.map((song) => (
            <SongCard song={song} key={song.id} selected={nowPlayingId === song.id} playing={nowPlayingId === song.id ? playing : false} />
          ))}

        {songs.isFetched && !!songs.data && (
          <Center mt="md">
            <Text c="dimmed" size="sm">
              End of playlist
            </Text>
          </Center>
        )}
      </Stack>
    </ScrollArea>
  );
}
