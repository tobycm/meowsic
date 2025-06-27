import { Glob } from "bun";
import { Database } from "bun:sqlite";

import { read } from "node-id3";
import { Song } from "./models";
import { databasePath, getDuration, parseInfoFromName } from "./utils";

export async function startup() {
  console.log("Starting up meowsic...");

  const db = new Database(databasePath, { create: true });

  db.run(`
    CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        last_modified INTEGER NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        title TEXT,
        artist TEXT,
        album_art BLOB,
        duration INTEGER
    )
`);

  const musicFolder = process.env.MUSIC_FOLDER || "../music";

  const glob = new Glob("*");

  const selectLastModified = db.query(`SELECT last_modified FROM files WHERE name = ?`).as(Song);
  const insertFile = db.query(
    `INSERT OR REPLACE INTO files (name, last_modified, added_at, title, artist, album_art, duration) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const jobs: Promise<void>[] = [];

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

      const duration = await getDuration(`${musicFolder}/${fileName}`);

      insertFile.run(fileName, file.lastModified, new Date().toISOString(), tags.title || null, tags.artist || null, image || null, duration || null);
    }

    jobs.push(processFile(fileName));
  }
}
