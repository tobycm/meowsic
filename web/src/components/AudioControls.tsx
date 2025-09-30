import { ActionIcon, Button, Group, Popover, Slider, Stack, Text, useMantineTheme } from "@mantine/core";
import {
  IconArrowsRight,
  IconArrowsShuffle,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconRepeat,
  IconRepeatOff,
  IconRepeatOnce,
  IconStopwatch,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import { useShallow } from "zustand/shallow";
import { humanTime } from "../lib/utils";
import { useNowPlaying } from "../states/NowPlaying";

export default function AudioControls() {
  const theme = useMantineTheme();

  const { togglePlay, toggleLoop, toggleShuffle, loadRandom, previous, next } = useNowPlaying(
    useShallow((state) => ({
      togglePlay: state.togglePlay,
      toggleLoop: state.toggleLoop,
      toggleShuffle: state.toggleShuffle,
      loadRandom: state.loadRandom,
      previous: state.previous,
      next: state.next,
    }))
  );

  const playing = useNowPlaying((state) => state.playing);
  const loop = useNowPlaying((state) => state.loop);
  const shuffle = useNowPlaying((state) => state.shuffle);
  const currentSong = useNowPlaying((state) => state.song);

  return (
    <Stack
      align="center"
      bg="#1e1e1e70"
      bdrs="xl"
      mx="xl"
      px="sm"
      py="lg"
      style={{ boxShadow: theme.shadows.lg, backdropFilter: "blur(24px)" }}
      flex={1}>
      <ProgressBar />

      <Group gap="md" mx="md" flex={1} w="100%" align="center" justify="center">
        <VolumeControl />
        <SpeedSelect />
        <ActionIcon
          onClick={() => {
            previous();
          }}
          variant="subtle"
          size="lg">
          <IconPlayerSkipBack size="1.2rem" />
        </ActionIcon>
        <ActionIcon
          onClick={() => {
            if (currentSong) return togglePlay();

            loadRandom();
          }}
          size="xl"
          radius="xl"
          style={{ flex: 0 }}>
          {playing ? <IconPlayerPause size="1.5rem" /> : <IconPlayerPlay size="1.5rem" />}
        </ActionIcon>
        <ActionIcon
          onClick={() => {
            next();
          }}
          variant="subtle"
          size="lg">
          <IconPlayerSkipForward size="1.2rem" />
        </ActionIcon>
        <ActionIcon
          onClick={() => {
            toggleShuffle(true);
          }}
          variant="subtle"
          size="lg">
          {shuffle ? <IconArrowsShuffle size="1.2rem" /> : <IconArrowsRight size="1.2rem" />}
        </ActionIcon>
        <ActionIcon onClick={toggleLoop} variant="subtle" size="lg">
          {loop === "off" ? <IconRepeatOff size="1.2rem" /> : loop === "one" ? <IconRepeatOnce size="1.2rem" /> : <IconRepeat size="1.2rem" />}
        </ActionIcon>
      </Group>
    </Stack>
  );
}

function ProgressBar() {
  const currentTime = useNowPlaying((state) => state.currentTime);
  const duration = useNowPlaying((state) => state.duration);
  const seek = useNowPlaying(useShallow((state) => state.seek));

  return (
    <Stack gap="md" mx="md" flex={5} w="100%" align="center">
      <Slider
        w="90%"
        size="xl"
        radius="md"
        value={currentTime}
        max={duration || 1} // Ensure max is at least 1 to prevent errors on load
        step={0.2}
        onChange={seek}
        label={null}
        styles={{ thumb: { transition: "opacity 150ms ease" } }}
      />

      <Text fz="xl" ta="center">
        {humanTime(new Date((currentTime || 0) * 1000))} / {humanTime(new Date((duration || 0) * 1000))}
      </Text>
    </Stack>
  );
}

function VolumeControl() {
  const volume = useNowPlaying((state) => state.volume);
  const muted = useNowPlaying((state) => state.muted);
  const setVolume = useNowPlaying((state) => state.setVolume);
  const toggleMuted = useNowPlaying((state) => state.toggleMuted);

  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon variant="subtle">{muted || volume === 0 ? <IconVolumeOff size="1.2rem" /> : <IconVolume size="1.2rem" />}</ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Group gap="xs">
          <ActionIcon onClick={toggleMuted} variant="subtle" size="lg">
            {muted ? <IconVolumeOff size="1.2rem" /> : <IconVolume size="1.2rem" />}
          </ActionIcon>
          <Slider
            value={muted ? 0 : volume}
            onChange={(value) => {
              if (muted && value > 0) {
                toggleMuted(); // Unmute if user slides up from 0
              }
              setVolume(value);
            }}
            max={1}
            step={0.01}
            label={null}
            style={{ flex: 1 }}
          />
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}

function SpeedSelect() {
  const { setPlaybackRate } = useNowPlaying(
    useShallow((state) => ({
      setPlaybackRate: state.setPlaybackRate,
    }))
  );

  const playbackRate = useNowPlaying((state) => state.playbackRate);

  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon variant="subtle">
          <IconStopwatch size="1.2rem" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="md" align="center" w="100%">
          <Slider onChange={setPlaybackRate} value={playbackRate} min={0.1} step={0.05} defaultValue={1} max={2} size="xl" radius="xl" w="100%" />

          <Group justify="space-between" w="100%">
            <Button onClick={() => setPlaybackRate(0.1)} variant="subtle" size="xs" radius="xl" style={{ flex: 1 }} miw="3rem">
              0.1x
            </Button>
            <Button onClick={() => setPlaybackRate(0.25)} variant="subtle" size="xs" radius="xl" style={{ flex: 1 }} miw="3rem">
              0.25x
            </Button>
            <Button onClick={() => setPlaybackRate(0.5)} variant="subtle" size="xs" radius="xl" style={{ flex: 1 }} miw="3rem">
              0.5x
            </Button>
            <Button onClick={() => setPlaybackRate(1)} variant="subtle" size="xs" radius="xl" style={{ flex: 1 }} miw="3rem">
              1x
            </Button>
            <Button onClick={() => setPlaybackRate(1.5)} variant="subtle" size="xs" radius="xl" style={{ flex: 1 }} miw="3rem">
              1.5x
            </Button>
            <Button onClick={() => setPlaybackRate(2)} variant="subtle" size="xs" radius="xl" style={{ flex: 1 }} miw="3rem">
              2x
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
