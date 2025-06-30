import { join } from "path";

const musicFolder = "../music/";

const corsOrigin = process.env.CORS_ORIGIN || "*";

Bun.serve({
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/favicon.ico") return new Response(Bun.file("./assets/favicon.ico"));

    const path = decodeURIComponent(url.pathname.replace("/music/", ""));

    const file = Bun.file(join(musicFolder, path));

    if (request.method === "OPTIONS") {
      return new Response("Departed", {
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Accept-Ranges": "bytes",
          "Content-Type": file.type,
        },
      });
    }

    return new Response(file, {
      headers: {
        Connection: "keep-alive",
        "Content-Range": `bytes 0-${file.size - 1}/${file.size}`,
        "Content-Length": file.size.toString(),
        "Content-Type": file.type,
      },
      status: 206,
    });
  },
  development: false,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3458,
});

console.log(`Music server is running at http://localhost:3458/music/`);
