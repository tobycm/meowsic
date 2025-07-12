import { t } from "elysia";

export class Song {
  id?: number;
  name?: string;
  last_modified?: number;
  added_at?: string;
  title?: string;
  artist?: string;
  duration?: number;
}

export const TImageTransform = t.Object({
  width: t.Optional(t.Number()),
  height: t.Optional(t.Number()),
});

export const TDatabaseFields = t.Union([
  t.Literal("id"),
  t.Literal("name"),
  t.Literal("last_modified"),
  t.Literal("added_at"),
  t.Literal("title"),
  t.Literal("artist"),
  t.Literal("duration"),
]);
