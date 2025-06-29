import { Divider, Flex, Image, ScrollArea, Skeleton, Text } from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import logo from "./assets/logo.svg";
import AudioControls from "./components/AudioControls";
import SongCard from "./components/SongCard";
import { useAppContext } from "./contexts/AppContext";
import { useAudioContext } from "./contexts/AudioContext";
import { Song } from "./lib/api";

function App() {
  const { api } = useAppContext();
  const {
    state: { song },
    load,
    play,
  } = useAudioContext();

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

  return (
    <Flex h="100vh" p="sm" bg="purp" c="primary" direction="column">
      <Image src={logo} miw={32} w="5vw" maw={64} m="sm" />
      <Flex direction={isMobile ? "column" : "row"} justify="center" align="center" style={{ flex: 1 }}>
        <ScrollArea h="60vh" w={isMobile ? "100%" : "42vw"}>
          <Flex direction="column" gap="md" p="md">
            {songs.data?.map((song) => (
              <SongCard
                song={song}
                key={song.id}
                flexProps={{ h: 80 }}
                onClick={(e) => {
                  e.stopPropagation();
                  load(song, true);
                  play();
                }}
              />
            ))}
          </Flex>
        </ScrollArea>
        <Flex direction="column" gap="md" p="md">
          {song ? (
            <Image src={song.albumArt} alt={`${song.title} by ${song.artist}`} bdrs="xl" h="auto" w="45vw" />
          ) : (
            <Skeleton h="calc(45vw/16*9)" w="45vw" bdrs="xl" />
          )}

          <AudioControls />
        </Flex>
      </Flex>
      <Flex direction="column" justify="center" align="center">
        <Divider h={2} w="95%" c="secondary" />
        <Text c="paper" size="sm">
          Built with Mantine, Vite, and &lt;3 | Copyright tobycm 2025
        </Text>
      </Flex>
    </Flex>
  );
}

export default App;
