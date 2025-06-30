import { Divider, Flex, Image, Text } from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";
import logo from "./assets/logo.svg";
import NowPlaying from "./components/NowPlaying";
import NowPlayingBackground from "./components/NowPlayingBackground";
import SongsList from "./components/SongsList";

function App() {
  const isMobile = useMediaQuery("(max-width: 48rem)");

  return (
    <Flex h="100vh" c="primary" direction="column" p={0}>
      <NowPlayingBackground />
      <Image src={logo} miw={32} w="5vw" maw={64} m="md" />
      <Flex direction={isMobile ? "column" : "row"} justify="center" align="center" flex={1}>
        <SongsList />

        <NowPlaying />
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
