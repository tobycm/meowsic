import { Flex, Image, Stack, Text } from "@mantine/core";

import { Song } from "../../lib/api";

import { IconDisc, IconPlayerPlay } from "@tabler/icons-react";
import { memo } from "react";
import { useShallow } from "zustand/shallow";
import { humanTime } from "../../lib/utils";
import { useNowPlaying } from "../../states/NowPlaying";

import { useHover } from "@mantine/hooks";
import classes from "./index.module.css";

function SongCard({ song, selected, playing }: { song: Song; selected?: boolean; playing?: boolean }) {
  const hover = useHover();

  const load = useNowPlaying(useShallow((state) => state.load));

  const duration = new Date(song.duration * 1000);

  return (
    <Flex
      ref={hover.ref}
      align="center"
      h={80}
      justify="flex-start"
      onClick={(e) => {
        e.stopPropagation();
        if (selected) return;
        load(song, true);
      }}
      style={{ cursor: "pointer" }}>
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
      <Stack justify="center" ml="md" miw={0} gap={0}>
        <Text size="lg" fw="bold" lineClamp={1}>
          {song.title}
        </Text>
        <Text lineClamp={1}>{song.artist}</Text>
        <Text>{humanTime(duration)}</Text>
      </Stack>

      {selected ? (
        <IconDisc
          className={classes.discSpin + (!playing ? " " + classes.discSpinPause : "")}
          size="3rem"
          style={{ margin: "16px", marginLeft: "auto" }}
        />
      ) : hover.hovered ? (
        <IconPlayerPlay size="3rem" style={{ margin: "16px", marginLeft: "auto" }} />
      ) : null}
    </Flex>
  );
}

export default memo(SongCard);
