/**
 * Resolves which AI provider to use at runtime so the same code works on
 * Lovable Cloud, Netlify and Cloudflare Workers.
 *
 * Priority:
 *  1. LOVABLE_API_KEY  -> Lovable AI Gateway (default on Lovable)
 *  2. OPENAI_API_KEY   -> OpenAI chat completions
 *  3. GEMINI_API_KEY   -> Google Gemini OpenAI-compatible endpoint
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
  name: "lovable" | "openai" | "gemini";
  transport: "chat-completions" | "gemini-content";
  url: string;
  headers: Record<string, string>;
  model: string;
};

function sanitizeGeminiModel(raw: string): string {
  // Strip any provider-style prefix regardless of how many segments it has
  // (e.g. "google/gemini-2.5-flash", "openrouter/google/gemini-2.5-flash",
  // "models/gemini-2.5-flash" all reduce to "gemini-2.5-flash"). AI_MODEL is
  // often copied between providers with mismatched naming conventions
  // (OpenRouter-style "vendor/model" vs Gemini's bare model id), so trusting
  // a fixed prefix list blindly can leave the URL malformed.
  const stripped = raw.trim().replace(/^.*\//, "");
  // Real Gemini model ids look like "gemini-2.5-flash" or "gemini-1.5-pro-002".
  const looksValid = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?$/.test(stripped);
  return looksValid ? stripped : "gemini-2.5-flash";
}

function normalizeLovableModel(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "google/gemini-2.5-flash";
  // Lovable's gateway expects an OpenRouter-style "vendor/model" id. AI_MODEL
  // is easy to set as a bare Gemini id (copied from the Gemini secret's
  // format, e.g. "gemini-2.5-pro"), which is missing the vendor prefix
  // Lovable needs to route the request correctly.
  if (trimmed.includes("/")) return trimmed;
  if (/^gemini-/i.test(trimmed)) return `google/${trimmed}`;
  return trimmed;
}

export function resolveAiProvider(): AiProvider {
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
    const model = sanitizeGeminiModel(readEnv("AI_MODEL") ?? "gemini-2.5-flash");

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
    "AI is not configured. Set LOVABLE_API_KEY (Lovable), or OPENAI_API_KEY / GEMINI_API_KEY in your Netlify or Cloudflare environment variables.",
  );
}
