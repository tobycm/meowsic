import { apiUrl } from ".";
import type { SongFields, SongResponse } from "./song";

export class MeowsicAPI {
  baseUrl: string;

  constructor(baseUrl: string = apiUrl) {
    this.baseUrl = baseUrl;
  }

  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async songs<Fields extends SongFields>(
    query: {
      limit?: number;
      offset?: number;
      sort?: "name" | "last_modified" | "added_at";
      order?: "asc" | "desc";

      search?: string;
      artist?: string;

      minDuration?: number;
      maxDuration?: number;

      albumArtTransform?: { width?: number; height?: number };
      fields?: Fields[];
    } = {}
  ): Promise<SongResponse<Fields>[]> {
    const params = new URLSearchParams();

    if (query.limit !== undefined) params.set("limit", query.limit.toString());
    if (query.offset !== undefined) params.set("offset", query.offset.toString());
    if (query.sort) params.set("sort", query.sort);
    if (query.order) params.set("order", query.order);

    if (query.search) params.set("search", query.search);
    if (query.artist) params.set("artist", query.artist);
    if (query.minDuration !== undefined) params.set("minDuration", query.minDuration.toString());
    if (query.maxDuration !== undefined) params.set("maxDuration", query.maxDuration.toString());
    if (query.albumArtTransform) params.set("albumArtTransform", JSON.stringify(query.albumArtTransform));
    if (query.fields && query.fields.length) params.set("fields", query.fields.join(","));

    return this.fetch<SongResponse<Fields>[]>(`/songs?${params.toString()}`);
  }

  async song<Fields extends SongFields>(
    id: string,
    query: { albumArtTransform?: { width?: number; height?: number }; fields?: Fields[] } = {}
  ): Promise<SongResponse<Fields>> {
    const params = new URLSearchParams();

    if (query.albumArtTransform) params.set("albumArtTransform", JSON.stringify(query.albumArtTransform));
    if (query.fields && query.fields.length) params.set("fields", query.fields.join(","));

    return this.fetch<SongResponse<Fields>>(`/songs/${id}?${params.toString()}`);
  }
}
