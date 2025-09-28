import { Box, Center, Loader, ScrollArea, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { useAppContext } from "../contexts/AppContext";
import { Song } from "../lib/api";
import { useNowPlaying } from "../states/NowPlaying";
import SongCard from "./SongCard";

export default function SongsList() {
  const { api } = useAppContext();

  const theme = useMantineTheme();

  const isMobile = useMediaQuery("(max-width: 56rem)");

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

  const load = useNowPlaying(useShallow((state) => state.load));

  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: songs.data?.length || 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 88, // The height of one item + gap (e.g., 80px height + 8px gap)
    overscan: 5, // Render 5 extra items above/below the viewport for smoother scrolling
  });

  const loadSong = useCallback(
    (song: Song, autoplay?: boolean) => {
      load(song, autoplay);
    },
    [load]
  );

  return (
    <ScrollArea
      h={isMobile ? "38vh" : "60vh"}
      w={isMobile ? "90%" : "42vw"}
      bdrs="xl"
      bg="#1e1e1e70"
      style={{ boxShadow: theme.shadows.lg, backdropFilter: "blur(24px)" }}
      viewportRef={scrollRef}>
      {!songs.isFetched && (
        <Center mt="xl">
          <Loader size="xl" />
        </Center>
      )}

      {songs.isFetched && !!songs.data && (
        <Box pos="relative" h={`${rowVirtualizer.getTotalSize()}px`} p="md">
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const song = songs.data![virtualItem.index];
            if (!song) return null;

            return (
              <Box
                key={virtualItem.key}
                pos="absolute"
                top={0}
                left={0}
                w="100%"
                h={virtualItem.size}
                py={4}
                px="md"
                style={{ transform: `translateY(${virtualItem.start}px)`, willChange: "transform" }}>
                <SongCard song={song} selected={nowPlayingId === song.id} playing={nowPlayingId === song.id ? playing : false} load={loadSong} />
              </Box>
            );
          })}
        </Box>
      )}

      {/* <Stack gap="md" p="md">
        {songs.isFetched &&
          !!songs.data &&
          songs.data.map((song) => (
            <SongCard song={song} key={song.id} selected={nowPlayingId === song.id} playing={nowPlayingId === song.id ? playing : false} />
          ))}
      </Stack> */}

      {songs.isFetched && !!songs.data && (
        <Center mt="md">
          <Text c="dimmed" size="sm">
            End of playlist
          </Text>
        </Center>
      )}
    </ScrollArea>
  );
}
