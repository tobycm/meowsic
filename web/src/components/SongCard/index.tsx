import { Flex, Image, Text } from "@mantine/core";

import { Song } from "../../lib/api";

import { memo } from "react";
import { useShallow } from "zustand/shallow";
import { humanTime } from "../../lib/utils";
import { useNowPlaying } from "../../states/NowPlaying";
import classes from "./index.module.css";

function SongCard({ song, isSelected }: { song: Song; isSelected?: boolean }) {
  const load = useNowPlaying(useShallow((state) => state.load));

  const duration = new Date(song.duration * 1000);

  return (
    <Flex
      className={`${classes.card} ${isSelected ? classes.selected : ""}`}
      h={80}
      onClick={(e) => {
        e.stopPropagation();
        load(song, true);
      }}>
      <Image
        src={song.albumArt}
        alt={`${song.name} by ${song.artist}`}
        radius="md"
        bdrs="md"
        h="100%"
        w="auto"
        style={{ aspectRatio: 1 }}
        loading="lazy"
      />
      <Flex direction="column" justify="center" ml="md" miw={0}>
        <Text size="lg" fw="bold" lineClamp={1}>
          {song.title}
        </Text>
        <Text lineClamp={1}>{song.artist}</Text>
        <Text>{humanTime(duration)}</Text>
      </Flex>
    </Flex>
  );
}

export default memo(SongCard);
