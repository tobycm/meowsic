export const musicFolder = process.env.MUSIC_FOLDER || "../music";
export const databasePath = process.env.DATABASE_PATH || "../data/meowsic.sqlite";
export const albumArtFolder = process.env.ALBUM_ART_FOLDER || "../data/album_art";
export const albumArtCacheFolder = process.env.ALBUM_ART_CACHE_FOLDER || "../data/album_art_cache";

export function parseInfoFromName(name: string): { artist?: string; title?: string } {
  let parts = name.split("[");
  parts.pop(); // Remove the last part which is usually the youtube ID and extension
  parts = parts.join("[").split(" - ");

  return {
    artist: parts.shift(),
    title: parts.join(" - ") || undefined,
  };
}

import { BunFile } from "bun";
import { exec } from "child_process";
import { mkdir } from "fs/promises";
import sharp from "sharp";

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

const allowedWidths = [80, 80 * 2, 80 * 3, 80 * 4]; // so it doesnt fill up the disk :b
const allowedHeights = [80, 80 * 2, 80 * 3, 80 * 4];

export async function getAlbumArt(id: number, options?: { width?: number; height?: number }): Promise<BunFile> {
  const originalFile = Bun.file(`${albumArtFolder}/${id}.png`);

  if (!options) return originalFile;

  const { width, height } = options;

  if (!width && !height) return originalFile;
  if (width && !allowedWidths.includes(width)) return originalFile;
  if (height && !allowedHeights.includes(height)) return originalFile;

  const file = Bun.file(`${albumArtCacheFolder}/${id}-${width || 0}-${height || 0}.png`);

  if (await file.exists()) return file;

  await mkdir(albumArtCacheFolder, { recursive: true });

  const image = sharp(await originalFile.arrayBuffer(), { failOnError: false }).resize({ width, height, fit: "inside" });

  const buffer = await image.toBuffer();
  await Bun.write(file, buffer);

  return Bun.file(`${albumArtCacheFolder}/${id}-${width || 0}-${height || 0}.png`);
}
