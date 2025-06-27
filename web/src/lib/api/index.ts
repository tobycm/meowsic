import { treaty } from "@elysiajs/eden";
import type { MeowsicAPI } from "../../../../backend/src";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const api = treaty<MeowsicAPI>("http://localhost:3457");

export type APIClient = typeof api;
