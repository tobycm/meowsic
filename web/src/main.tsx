import { scan } from "react-scan"; // must be imported before React and React DOM

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@mantine/core/styles.css";

import "@fontsource/ubuntu/300.css";
import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/500.css";
import "@fontsource/ubuntu/700.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App.tsx";
import AppProvider from "./contexts/AppContext.tsx";
import { api } from "./lib/api";

import { WindowHistoryAdapter } from "use-query-params/adapters/window";

import { colorsTuple, createTheme, MantineProvider } from "@mantine/core";
import { QueryParamProvider } from "use-query-params";
import Hotkeys from "./components/Hotkeys.tsx";
import MediaSession from "./components/MediaSession.tsx";
import Player from "./components/Player.tsx";
import "./index.css";
import { useAppState } from "./states/AppState.ts";

scan({
  enabled: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  const dominantColor = useAppState((state) => state.dominantColor);

  const theme = createTheme({
    primaryColor: "primary",

    fontFamily: "Ubuntu, sans-serif",
    headings: { fontFamily: "Ubuntu, sans-serif" },

    colors: {
      primary: colorsTuple(dominantColor || "#ffafcc"),
      secondary: colorsTuple("#cdb4db"),
      error: colorsTuple("#ff006e"),
      warn: colorsTuple("#ffbe0b"),
      info: colorsTuple("#ffc8dd"),
      success: colorsTuple("#3a86ff"),
      purp: colorsTuple("#571089"),
      paper: colorsTuple("#efd9ce"),
      vgrey: colorsTuple("#1e1e1e"),
    },
  });

  return (
    <MantineProvider theme={theme}>
      <QueryParamProvider adapter={WindowHistoryAdapter}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />

          <AppProvider api={api}>
            <MediaSession />
            <Hotkeys />
            <Player />
            <App />
          </AppProvider>
        </QueryClientProvider>
      </QueryParamProvider>
    </MantineProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
