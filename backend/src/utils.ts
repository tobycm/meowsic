export const databasePath = process.env.DATABASE_PATH || "../data/meowsic.sqlite";

export function parseInfoFromName(name: string): { artist?: string; title?: string } {
  let parts = name.split("[");
  parts.pop(); // Remove the last part which is usually the youtube ID and extension
  parts = parts.join("[").split(" - ");

  return {
    artist: parts.shift(),
    title: parts.join(" - ") || undefined,
  };
}

import { exec } from "child_process";

// with ffprobe
export const getDuration = (filePath: string): Promise<number | undefined> =>
  new Promise<number | undefined>((resolve, reject) =>
    exec(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
      { encoding: "utf8" },
      (error, stdout) => {
        if (error) return reject(error);

        const duration = parseFloat(stdout.trim());
        resolve(isNaN(duration) ? undefined : duration);
      }
    )
  );
