import { ActionIcon, Group, Slider, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay, IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { useShallow } from "zustand/shallow";
import { humanTime } from "../../lib/utils";
import { useNowPlaying } from "../../states/NowPlaying";

export default function AudioControls() {
  const theme = useMantineTheme();

  const { play, pause } = useNowPlaying(
    useShallow((state) => ({
      play: state.play,
      pause: state.pause,
      setVolume: state.setVolume,
      toggleMuted: state.toggleMuted,
    }))
  );

  const playing = useNowPlaying((state) => state.playing);

  return (
    <Stack align="center" bdrs="xl" mx="xl" px="sm" py="lg" style={{ boxShadow: theme.shadows.lg, backdropFilter: "blur(24px)" }} flex={1}>
      <ProgressBar />

      <Group gap="md" mx="md" flex={1} w="100%" align="center" justify="center">
        <VolumeControl />
        <ActionIcon
          onClick={() => {
            if (playing) pause();
            else play();
          }}
          size="xl"
          radius="xl"
          style={{ flex: 0 }}>
          {playing ? <IconPlayerPause size="1.5rem" /> : <IconPlayerPlay size="1.5rem" />}
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
        onChange={(value) => {
          console.log(currentTime);
          seek(value);
        }}
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
    <Group gap="md" mx="md" w={200}>
      <ActionIcon onClick={() => toggleMuted()} variant="subtle">
        {muted ? <IconVolumeOff size="1.2rem" /> : <IconVolume size="1.2rem" />}
      </ActionIcon>
      <Slider
        value={volume}
        onChange={(value) => {
          setVolume(value);
        }}
        flex={1}
        max={1}
        step={0.01}
        label={null}
      />
    </Group>
  );
}
