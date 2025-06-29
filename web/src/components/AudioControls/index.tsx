import { ActionIcon, Group, Slider, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay, IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { useAudioContext } from "../../contexts/AudioContext";
import { humanTime } from "../../lib/utils";

export default function AudioControls() {
  const theme = useMantineTheme();

  const {
    state: { playing, currentTime, duration, volume, muted },
    play,
    pause,
    seek,
    setVolume,
    toggleMuted,
  } = useAudioContext();

  return (
    <Stack pos="relative" align="center" bdrs={8} mx="xl" px="sm" py="lg" style={{ boxShadow: theme.shadows.sm }} flex={1}>
      <Group gap="md" mx="md" flex={1} w="100%">
        <Slider
          flex={5}
          value={currentTime}
          max={duration || 1} // Ensure max is at least 1 to prevent errors on load
          onChange={(value) => seek(value)}
          label={null}
          styles={{ thumb: { transition: "opacity 150ms ease" } }}
        />

        <Text fz="sm" ta="center">
          {humanTime(new Date((currentTime || 0) * 1000))} / {humanTime(new Date((duration || 0) * 1000))}
        </Text>

        <ActionIcon onClick={toggleMuted} variant="subtle">
          {muted ? <IconVolumeOff size="1.2rem" /> : <IconVolume size="1.2rem" />}
        </ActionIcon>
        <Slider
          value={volume}
          onChange={(value) => {
            setVolume(value);
          }}
          max={1}
          step={0.01}
          label={null}
          flex={1}
        />
      </Group>

      <ActionIcon
        onClick={() => {
          if (playing) pause();
          else play();
        }}
        size="xl"
        radius="xl"
        variant="filled"
        color="blue"
        style={{ flexShrink: 0 }}>
        {playing ? <IconPlayerPause size="1.5rem" /> : <IconPlayerPlay size="1.5rem" />}
      </ActionIcon>
    </Stack>
  );
}
