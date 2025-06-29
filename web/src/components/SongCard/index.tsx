import { Flex, Image, Text } from "@mantine/core";

import { Song } from "../../lib/api";

import { useAudioContext } from "../../contexts/AudioContext";
import { humanTime } from "../../lib/utils";
import classes from "./index.module.css";

export default function SongCard({
  song,
  flexProps,
  onClick,
}: {
  song: Song;
  flexProps?: React.ComponentProps<typeof Flex>;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const { song: npSong } = useAudioContext();

  const duration = new Date(song.duration * 1000);

  const selected = npSong?.id === song.id;

  return (
    <Flex className={`${classes.card} ${selected ? classes.selected : ""}`} onClick={onClick} {...flexProps}>
      <Image src={song.albumArt} alt={`${song.name} by ${song.artist}`} radius="md" bdrs="md" h="100%" w="auto" style={{ aspectRatio: 1 }} />
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
