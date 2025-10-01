import { Flex, Image, Stack } from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";
import { useShallow } from "zustand/shallow";
import logo from "./assets/logo.svg";
import NowPlaying from "./components/NowPlaying";
import NowPlayingBackground from "./components/NowPlayingBackground";
import SongsList from "./components/SongsList";
import { useNowPlaying } from "./states/NowPlaying";

function App() {
  const isMobile = useMediaQuery("(max-width: 56rem)");

  const clear = useNowPlaying(useShallow((state) => state.clear));

  return (
    <Stack h="100vh" c="primary" p={0}>
      <NowPlayingBackground />
      <Image src={logo} miw={32} w="5vw" maw={64} m="md" mb={0} onClick={clear} />
      <Flex direction={isMobile ? "column" : "row"} justify={isMobile ? "space-between" : "center"} align="center" flex={1}>
        {isMobile && <NowPlaying />}

        <SongsList />

        {!isMobile && <NowPlaying />}
      </Flex>
      {/* {!isMobile && (
        <Stack justify="center" align="center" m="lg">
          <Divider h={2} w="95%" c="secondary" />
          <Text c="paper" size="sm">
            Built with Mantine, Vite, and &lt;3 | Copyright tobycm 2025
          </Text>
        </Stack>
      )} */}
    </Stack>
  );
}

export default App;
