import { Glob } from "bun";
import { Database } from "bun:sqlite";
import { freemem } from "os";

import { read } from "node-id3";
import { Song } from "./models";
import { albumArtFolder, databasePath, getDuration, parseInfoFromName } from "./utils";

export async function startup() {
  console.log("Starting up meowsic...");

  const db = new Database(databasePath);

  const musicFolder = process.env.MUSIC_FOLDER || "../music";

  const glob = new Glob("*");

  const selectLastModified = db.query(`SELECT last_modified FROM files WHERE name = ?`).as(Song);
  const insertFile = db
    .query(
      `
        INSERT OR REPLACE INTO files (
          name,
          last_modified,
          added_at,
          title,
          artist,
          duration
        )
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING id
      `
    )
    .as(Song);

  const lowMem = process.env.OVERRIDE_MEMORY_CHECK != "true" && freemem() < 1 * 1024 * 1024 * 1024;

  const jobs: Promise<void>[] = [];

  let dirty = false;

  for (const fileName of glob.scanSync(musicFolder)) {
    if (!fileName.endsWith(".mp3")) continue;

    const file = Bun.file(`${musicFolder}/${fileName}`);

    if (selectLastModified.get(fileName)?.last_modified === file.lastModified) continue;

    async function processFile(fileName: string) {
      console.log(`Processing file: ${fileName}`);

      const tags = read(file.name!);

      if (!tags.artist || !tags.title) {
        // If the tags are missing, try to parse them from the file name
        const parsedInfo = parseInfoFromName(fileName);
        tags.artist = parsedInfo.artist || "Unknown Artist";
        tags.title = parsedInfo.title || fileName.replace(/\.mp3$/, "") || "Unknown Title";
      }

      let image: Buffer | undefined = undefined;

      if (tags.image && typeof tags.image !== "string") image = tags.image.imageBuffer;

      const duration = await getDuration(file.name!);

      const row = insertFile.get(fileName, file.lastModified, new Date().toISOString(), tags.title || null, tags.artist || null, duration || null);

      if (!row) {
        console.error(`Failed to insert file: ${fileName}`);
        return;
      }

      if (!image) return;

      const artFile = Bun.file(`${albumArtFolder}/${row.id}.png`);
      await artFile.write(image);
    }

    if (lowMem) await processFile(fileName);
    else jobs.push(processFile(fileName)); // Process the file asynchronously

    dirty = true;
  }

  await Promise.all(jobs);

  const deleteFile = db.query("DELETE FROM files WHERE id = ? RETURNING id").as(Song);

  for (const file of db.query("SELECT id, name FROM files").as(Song)) {
    if (await Bun.file(`${musicFolder}/${file.name}`).exists()) return;

    console.log(`File not found: ${`${musicFolder}/${file.name}`}, deleting from database.`);
    deleteFile.run(file.id!);

    const artFile = Bun.file(`${albumArtFolder}/${file.id}.png`);
    if (await artFile.exists()) {
      console.log(`Deleting album art for file: ${file.name}`);
      await artFile.unlink();
    }

    dirty = true;
  }

  if (dirty) {
    db.run(`REINDEX files;`);
  } else {
    console.log("No new files found, database is up to date.");
  }
}
