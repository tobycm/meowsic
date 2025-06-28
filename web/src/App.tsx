import { Divider, Flex, Image, ScrollArea, Text } from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import logo from "./assets/logo.svg";
import SongCard from "./components/SongCard";
import { useAppContext } from "./contexts/AppContext";

function App() {
  const { api, nowPlaying, setNowPlaying } = useAppContext();

  const isMobile = useMediaQuery("(max-width: 48rem)");

  const songs = useQuery({
    queryKey: ["songs", 20, ["id", "name", "title", "artist", "added_at", "album_art", "duration"], { height: 80 }],
    queryFn: () =>
      api.songs({
        limit: 20,
        fields: ["id", "name", "title", "artist", "added_at", "album_art", "duration"],
        albumArtTransform: { height: 80 },
      }),
  });

  if (!songs.data) {
    return <Text>Loading...</Text>;
  }

  console.log("Now playing:", nowPlaying);

  return (
    <Flex h="100vh" p="sm" bg="purp" c="primary" direction="column">
      <Image src={logo} miw={32} w="5vw" maw={64} m="sm" />
      <Flex direction={isMobile ? "column" : "row"} justify="center" align="center" style={{ flex: 1 }}>
        {!!songs.data?.length && (
          <ScrollArea h="60vh">
            <Flex direction="column" gap="md" p="md">
              {songs.data!.map((song) => (
                <SongCard
                  song={{ ...song, albumArt: song.album_art }}
                  key={song.id}
                  flexProps={{ h: 80, w: isMobile ? "100%" : "42vw" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setNowPlaying({
                      song: {
                        id: song.id,
                        name: song.name,
                        title: song.title,
                        artist: song.artist,
                        albumArt: song.album_art,
                        duration: song.duration,
                      },
                      progress: 0,
                      isPlaying: true,
                    });
                  }}
                />
              ))}
            </Flex>
          </ScrollArea>
        )}
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
