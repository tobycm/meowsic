import { ScrollArea, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../contexts/AppContext";
import { Song } from "../lib/api";
import { useNowPlaying } from "../states/NowPlaying";
import SongCard from "./SongCard";

export default function SongsList() {
  const { api } = useAppContext();

  const isMobile = useMediaQuery("(max-width: 48rem)");

  const songs = useQuery({
    queryKey: ["songs", 200, ["id", "name", "title", "artist", "duration"]],
    queryFn: async () => {
      const songs = await api.songs({
        limit: 200,
        fields: ["id", "name", "title", "artist", "duration"],
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
    initialData: [],
  });

  const nowPlayingId = useNowPlaying((state) => state.song?.id);

  return (
    <ScrollArea h="60vh" w={isMobile ? "100%" : "42vw"}>
      <Stack gap="md" p="md">
        {songs.data?.map((song) => (
          <SongCard song={song} key={song.id} isSelected={nowPlayingId === song.id} />
        ))}
      </Stack>
    </ScrollArea>
  );
}
