import { swagger } from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import config from "./config";

const app = new Elysia()
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

  .listen(3457);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export type MeowsicAPI = typeof app;
