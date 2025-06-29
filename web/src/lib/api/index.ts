import { MeowsicAPI } from "./api";
import { Song } from "./song";

export const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:3457" : window.location.origin);

export const musicUrl =
  import.meta.env.VITE_MUSIC_URL || (window.location.hostname === "localhost" ? "http://localhost:3458" : window.location.origin);

export const api = new MeowsicAPI(apiUrl);

export { MeowsicAPI, Song };
