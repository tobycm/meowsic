import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@mantine/core/styles.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App.tsx";
import AppProvider from "./contexts/AppContext.tsx";
import { api } from "./lib/api";
import theme from "./theme.ts";

import { MantineProvider } from "@mantine/core";
import AudioProvider from "./contexts/AudioContext.tsx";
import "./index.css";

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
          <AudioProvider>
            <App />
          </AudioProvider>
        </AppProvider>
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>
);
