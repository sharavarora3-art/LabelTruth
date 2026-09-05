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
      model: readEnv("AI_MODEL") ?? "google/gemini-3.6-flash",
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
    const model = (readEnv("AI_MODEL") ?? "gemini-2.5-flash")
      .replace(/^google\//, "")
      .replace(/^models\//, "");

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
