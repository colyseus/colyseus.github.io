import type { APIRoute } from "astro";
import { PRESETS, buildPrompt } from "../../../data/ai-prompts";

/** Raw prompt per preset, e.g. `claude "$(curl -fsSL https://colyseus.io/ai/prompts/arena-shooter.txt)"`. */
export function getStaticPaths() {
  return PRESETS.map((preset) => ({ params: { id: preset.id } }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(buildPrompt(params.id!), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
