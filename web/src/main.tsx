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
import theme from "./theme.ts";

import { MantineProvider } from "@mantine/core";
import Player from "./components/Player.tsx";
import "./index.css";

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />

        <AppProvider api={api}>
          <Player />
          <App />
        </AppProvider>
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>
);
