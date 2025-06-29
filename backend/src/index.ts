import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import Database from "bun:sqlite";
import { Elysia, t } from "elysia";
import sharp from "sharp";
import config from "./config";
import { Song, TImageTransform } from "./models";
import { startup } from "./startup";
import { databasePath } from "./utils";

await startup();

// db should be ready
const db = new Database(databasePath);

const app = new Elysia()
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || "*", // Allow all origins by default, can be overridden by environment variable
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "meowsic API",
          description: "API documentation for meowsic",
          version: "1.0.0",
        },
      },
    })
  )
  .get("/", () => "Hello Elysia and meowsic!")
  .get("/favicon.ico", () => Bun.file("./assets/favicon.ico"))
  .get(
    "/config/:keysString",
    ({ params }) => {
      const { keysString } = params;

      if (keysString === "all") {
        return config;
      }

      const keys = keysString.split(",");

      return Object.fromEntries(Object.entries(config).filter(([key]) => keys.includes(key)));
    },
    {
      params: t.Object({
        keysString: t.String(),
      }),
    }
  )
  .get(
    "/songs",
    async ({ query }) => {
      const {
        limit = 100,
        offset = 0,
        sort = "name",
        order = "asc",
        search = "",
        artist = "",
        minDuration,
        maxDuration,
        fields = ["id", "name", "last_modified", "added_at", "title", "artist", "duration"],

        albumArtTransform,
      } = query;

      let sqlStatement = `SELECT ${fields.join(", ")} FROM files`;
      const preparedFields = [];

      const conditions = [];
      if (search) {
        conditions.push(`(name LIKE ? OR title LIKE ? OR artist LIKE ?)`);
        preparedFields.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (artist) {
        conditions.push(`artist LIKE ?`);
        preparedFields.push(`%${artist}%`);
      }

      if (minDuration !== undefined) conditions.push(`duration >= ${minDuration}`);
      if (maxDuration !== undefined) conditions.push(`duration <= ${maxDuration}`);

      if (conditions.length > 0) sqlStatement += ` WHERE ${conditions.join(" AND ")}`;

      if (sort) sqlStatement += ` ORDER BY ${sort} ${order.toUpperCase()}`;
      if (limit) sqlStatement += ` LIMIT ${limit}`;
      if (offset) sqlStatement += ` OFFSET ${offset}`;

      // console.log("SQL Statement:", sqlStatement);

      const songs = db
        .prepare(sqlStatement)
        .as(Song)
        .all(...preparedFields);

      if (albumArtTransform) {
        const promises: Promise<void>[] = [];

        for (const song of songs) {
          if (!song.album_art) continue;

          let image = sharp(Buffer.from(song.album_art), { failOnError: false });

          if (albumArtTransform.width || albumArtTransform.height) {
            image = image.resize({
              width: albumArtTransform.width,
              height: albumArtTransform.height,
              fit: "inside",
            });
          }

          promises.push(
            (async () => {
              song.album_art = await image.toBuffer();
            })()
          );
        }

        await Promise.all(promises);
      }

      return songs.map((song) => ({
        ...song,
        album_art: song.album_art ? `data:image/png;base64,${song.album_art.toBase64()}` : undefined,
      }));
    },
    {
      query: t.Object({
        limit: t.Optional(t.Number({ default: 100 })),
        offset: t.Optional(t.Number({ default: 0 })),

        sort: t.Optional(t.Union([t.Literal("name"), t.Literal("last_modified"), t.Literal("added_at")], { default: "name" })),
        order: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")], { default: "asc" })),

        search: t.Optional(t.String()),
        artist: t.Optional(t.String()),

        minDuration: t.Optional(t.Number()),
        maxDuration: t.Optional(t.Number()),

        albumArtTransform: t.Optional(TImageTransform),

        fields: t.Optional(t.Array(t.String(), { default: ["id", "name", "last_modified", "added_at", "title", "artist", "duration"] })),
      }),
    }
  )
  .get(
    "/songs/:id",
    async ({ params, query }) => {
      const { id } = params;
      const { fields = ["id", "name", "last_modified", "added_at", "title", "artist", "duration"], albumArtTransform } = query;
      const song = db
        .query(`SELECT ${fields.join(", ")} FROM files WHERE id = ?`)
        .as(Song)
        .get(id);

      if (!song) return new Response("Song not found", { status: 404 });

      if (albumArtTransform && song.album_art) {
        let image = sharp(Buffer.from(song.album_art), { failOnError: false });

        if (albumArtTransform.width || albumArtTransform.height) {
          image = image.resize({
            width: albumArtTransform.width,
            height: albumArtTransform.height,
            fit: "inside",
          });
        }

        song.album_art = await image.toBuffer();
      }

      return {
        ...song,
        album_art: song.album_art ? `data:image/png;base64,${song.album_art.toBase64()}` : undefined,
      };
    },
    {
      params: t.Object({
        id: t.Number(),
      }),

      query: t.Object({
        albumArtTransform: t.Optional(TImageTransform),

        fields: t.Optional(t.Array(t.String(), { default: ["id", "name", "last_modified", "added_at", "title", "artist", "duration"] })),
      }),
    }
  )
  .get(
    "/songs/:id/album-art",
    async ({ params, query }) => {
      const { id } = params;
      const { width, height } = query;
      const song = db.query("SELECT album_art FROM files WHERE id = ?").as(Song).get(id);
      if (!song || !song.album_art) return new Response("Album art not found", { status: 404 });

      let image = sharp(Buffer.from(song.album_art), { failOnError: false });
      if (width || height) {
        image = image.resize({
          width: width ? parseInt(width.toString(), 10) : undefined,
          height: height ? parseInt(height.toString(), 10) : undefined,
          fit: "inside",
        });
      }
      const buffer = await image.toBuffer();
      return new Response(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      });
    },
    {
      params: t.Object({
        id: t.Number(),
      }),

      query: TImageTransform,
    }
  )

  .listen(3457);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export type MeowsicAPI = typeof app;
