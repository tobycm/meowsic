import { apiUrl, musicUrl } from ".";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// export const api = treaty<MeowsicAPI>(apiUrl);
interface SongOptions {
  id: number;
  name: string;
  title?: string;
  artist?: string;
  albumArt?: string;
  duration: number;

  albumArtOptions?: AlbumArtOptions;
}
interface AlbumArtOptions {
  width?: number;
  height?: number;
}

export class Song {
  id: number;
  name: string;
  title: string;
  artist: string;
  #albumArt: string | undefined;
  albumArtOptions: AlbumArtOptions | undefined;
  duration: number;

  constructor(options: SongOptions) {
    this.id = options.id;
    this.name = options.name;
    this.title = options.title || "";
    this.artist = options.artist || "";
    this.#albumArt = options.albumArt;
    this.albumArtOptions = options.albumArtOptions;
    this.duration = options.duration;
  }

  get src(): string {
    return new URL(musicUrl + `/music/${this.name}`).toString();
  }

  get url(): string {
    return new URL(apiUrl + `/songs/${this.id}`).toString();
  }

  albumArt(options?: AlbumArtOptions): string | undefined {
    if (this.#albumArt) return this.#albumArt;

    const { width, height } = options || this.albumArtOptions || {};

    const url = new URL(apiUrl + `/songs/${this.id}/album-art`);
    if (width) url.searchParams.set("width", width.toString());
    if (height) url.searchParams.set("height", height.toString());

    return url.toString();
  }

  get extension(): string {
    return this.name.split(".").pop() || "";
  }
}
export type SongFields = "id" | "name" | "last_modified" | "added_at" | "title" | "artist" | "album_art" | "duration";
export type SongResponse<T extends SongFields> = {
  [K in T]: K extends "duration" | "id" ? number : string;
};
