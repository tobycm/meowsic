import { Center, Loader, ScrollArea, Stack, Text, useMantineTheme } from "@mantine/core";
import { useIntersection, useMediaQuery } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useAppContext } from "../contexts/AppContext";
import { Song } from "../lib/api";
import { useNowPlaying } from "../states/NowPlaying";
import SongCard from "./SongCard";

const PageLimit = 20;

export default function SongsList() {
  const { api } = useAppContext();

  const theme = useMantineTheme();

  const isMobile = useMediaQuery("(max-width: 48rem)");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["songs", ["id", "name", "title", "artist", "duration"]],

    queryFn: async ({ pageParam }) => {
      const songs = await api.songs({
        limit: PageLimit,
        offset: pageParam,
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
    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PageLimit) {
        return undefined;
      }

      return allPages.length * PageLimit;
    },
  });

  const lastSongsRef = useRef(null);
  const { ref, entry } = useIntersection({
    root: lastSongsRef.current,
    threshold: 0.1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, fetchNextPage]);

  const songs = data?.pages.flatMap((page) => page) ?? [];

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
        {songs.map((song) => (
          <SongCard song={song} key={song.id} selected={nowPlayingId === song.id} playing={nowPlayingId === song.id ? playing : false} />
        ))}

        {/* This is the trigger element */}
        <Center ref={ref} mt="md">
          {isFetchingNextPage && <Loader />}
          {!hasNextPage && songs.length > 0 && (
            <Text c="dimmed" size="sm">
              End of playlist
            </Text>
          )}
        </Center>
      </Stack>
    </ScrollArea>
  );
}
