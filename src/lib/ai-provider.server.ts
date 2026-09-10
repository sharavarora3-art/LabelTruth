/**
 * Resolves which AI provider to use at runtime so the same code works on
 * Lovable Cloud, Netlify and Cloudflare Workers.
 *
 * Priority:
 *  1. CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN -> Workers AI (free daily
 *     allowance, native to this app's own Cloudflare infrastructure)
 *  2. LOVABLE_API_KEY  -> Lovable AI Gateway (default on Lovable)
 *  3. OPENAI_API_KEY   -> OpenAI chat completions
 *  4. GEMINI_API_KEY   -> Google Gemini OpenAI-compatible endpoint
 *
 * Cloudflare Workers inject env per-request rather than on process.env, so we
 * read both process.env and the Worker env exposed on globalThis.
 */

type Env = Record<string, string | undefined>;

function readEnv(name: string): string | undefined {
  const fromProcess =
    typeof process !== "undefined" ? (process.env as Env | undefined)?.[name] : undefined;
  if (fromProcess) return fromProcess;

  const g = globalThis as unknown as { __env__?: Env; env?: Env };
  return g.__env__?.[name] ?? g.env?.[name] ?? undefined;
}

export type AiProvider = {
  name: "workers-ai" | "lovable" | "openai" | "gemini";
  transport: "chat-completions" | "gemini-content";
  url: string;
  headers: Record<string, string>;
  model: string;
};

function sanitizeGeminiModel(raw: string): string {
  // Strip any provider-style prefix regardless of how many segments it has
  // (e.g. "google/gemini-3.6-flash", "openrouter/google/gemini-3.6-flash",
  // "models/gemini-3.6-flash" all reduce to "gemini-3.6-flash"). AI_MODEL is
  // often copied between providers with mismatched naming conventions
  // (OpenRouter-style "vendor/model" vs Gemini's bare model id), so trusting
  // a fixed prefix list blindly can leave the URL malformed.
  const stripped = raw.trim().replace(/^.*\//, "");
  // Real Gemini model ids look like "gemini-3.6-flash" or "gemini-1.5-pro-002".
  const looksValid = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?$/.test(stripped);
  // Google's 2.x line is being retired through 2026 (2.0 shut down June
  // 2026, 2.5 Pro retires Oct 16 2026); Google's own API error for 2.5-flash
  // explicitly names gemini-3.6-flash as the replacement - fall back to that
  // instead of a soon-to-be-dead alias.
  return looksValid ? stripped : "gemini-3.6-flash";
}

function normalizeLovableModel(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "google/gemini-3.6-flash";
  // Lovable's gateway expects an OpenRouter-style "vendor/model" id. AI_MODEL
  // is easy to set as a bare Gemini id (copied from the Gemini secret's
  // format, e.g. "gemini-2.5-pro"), which is missing the vendor prefix
  // Lovable needs to route the request correctly.
  if (trimmed.includes("/")) return trimmed;
  if (/^gemini-/i.test(trimmed)) return `google/${trimmed}`;
  return trimmed;
}

function sanitizeWorkersAiModel(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim();
  // AI_MODEL is shared across every provider branch in this file, so it's
  // easy for it to be left over from a different provider (a bare Gemini or
  // OpenAI model id). Only trust it here if it's actually a Workers AI model
  // id (the "@cf/" catalog prefix); otherwise use a known-good vision model.
  return trimmed.startsWith("@cf/") ? trimmed : "@cf/meta/llama-3.2-11b-vision-instruct";
}

export function resolveAiProvider(): AiProvider {
  const cfAccountId = readEnv("CLOUDFLARE_ACCOUNT_ID");
  const cfApiToken = readEnv("CLOUDFLARE_API_TOKEN");
  if (cfAccountId && cfApiToken) {
    return {
      name: "workers-ai",
      transport: "chat-completions",
      url: `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/v1/chat/completions`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfApiToken}`,
      },
      model: sanitizeWorkersAiModel(readEnv("AI_MODEL")),
    };
  }

  const lovable = readEnv("LOVABLE_API_KEY");
  if (lovable) {
    return {
      name: "lovable",
      transport: "chat-completions",
      url: "https://ai.gateway.lovable.dev/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": lovable,
        "X-Lovable-AIG-SDK": "fetch",
      },
      model: normalizeLovableModel(readEnv("AI_MODEL")),
    };
  }

  const openai = readEnv("OPENAI_API_KEY");
  if (openai) {
    return {
      name: "openai",
      transport: "chat-completions",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openai}`,
      },
      model: readEnv("AI_MODEL") ?? "gpt-4o-mini",
    };
  }

  const gemini = readEnv("GEMINI_API_KEY") ?? readEnv("GOOGLE_API_KEY");
  if (gemini) {
    const model = sanitizeGeminiModel(readEnv("AI_MODEL") ?? "gemini-3.6-flash");

    return {
      name: "gemini",
      transport: "gemini-content",
      url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": gemini,
      },
      model,
    };
  }

  throw new Error(
    "AI is not configured. Set CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN (Workers AI), LOVABLE_API_KEY (Lovable), or OPENAI_API_KEY / GEMINI_API_KEY in your Netlify or Cloudflare environment variables.",
  );
}
