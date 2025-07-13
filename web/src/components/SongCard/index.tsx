import { Flex, Image, Skeleton, Stack, Text, useMantineTheme } from "@mantine/core";

import { IconDisc, IconPlayerPlay } from "@tabler/icons-react";
import { memo, useState } from "react";
import { useShallow } from "zustand/shallow";

import { Song } from "../../lib/api";
import { humanTime } from "../../lib/utils";
import { useNowPlaying } from "../../states/NowPlaying";

import { useHover, useMediaQuery } from "@mantine/hooks";
import classes from "./index.module.css";

function SongCard({ song, selected, playing }: { song: Song; selected?: boolean; playing?: boolean }) {
  const theme = useMantineTheme();

  const isMobile = useMediaQuery("(max-width: 48rem)");

  const hover = useHover();

  const load = useNowPlaying(useShallow((state) => state.load));

  const duration = new Date(song.duration * 1000);

  const [imageLoaded, setImageLoaded] = useState(false);

  const height = isMobile ? 64 : 80;

  return (
    <Flex
      ref={hover.ref}
      align="center"
      h={height}
      justify="flex-start"
      onClick={(e) => {
        e.stopPropagation();
        if (selected) return;
        load(song, true);
      }}
      style={{ cursor: "pointer", transition: "background-color 0.2s ease-in-out", boxShadow: theme.shadows.sm }}>
      <Skeleton visible={!imageLoaded} h={height} w={height} bdrs="md" miw={height} mih={height} animate>
        <Image
          src={song.albumArt()}
          srcSet={`
            ${song.albumArt({ height: 320 })} 320w,
            ${song.albumArt({ height: 240 })} 240w,
            ${song.albumArt({ height: 160 })} 160w,
            ${song.albumArt({ height: 80 })} 80w
            `}
          sizes="80px"
          alt={`${song.name} by ${song.artist}`}
          radius="md"
          bdrs="md"
          h="100%"
          w="auto"
          style={{ aspectRatio: 1 }}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
      </Skeleton>
      <Stack justify="center" ml="md" miw={0} gap={0}>
        <Text size={isMobile ? "md" : "lg"} fw="bold" lineClamp={1}>
          {song.title}
        </Text>
        <Text size={isMobile ? "sm" : undefined} lineClamp={1}>
          {song.artist}
        </Text>
        <Text size={isMobile ? "sm" : undefined}>{humanTime(duration)}</Text>
      </Stack>

      {selected ? (
        <IconDisc
          className={classes.discSpin + (!playing ? " " + classes.discSpinPause : "")}
          size="3rem"
          style={{ margin: "16px", marginLeft: "auto", flexShrink: 0 }}
        />
      ) : hover.hovered ? (
        <IconPlayerPlay size="3rem" style={{ margin: "16px", marginLeft: "auto", flexShrink: 0 }} />
      ) : null}
    </Flex>
  );
}

export default memo(SongCard);
