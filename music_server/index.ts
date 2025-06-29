import { join } from "path";

const musicFolder = "../music/";

Bun.serve({
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/favicon.ico") return new Response(Bun.file("./assets/favicon.ico"));

    const path = decodeURIComponent(url.pathname.replace("/music/", ""));

    if (request.method === "OPTIONS") {
      return new Response("Departed", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
      });
    }

    const response = new Response(Bun.file(join(musicFolder, path)));

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Content-Type", "audio/mpeg");

    return response;
  },
  development: false,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3458,
});

console.log(`Music server is running at http://localhost:3458/music/`);
