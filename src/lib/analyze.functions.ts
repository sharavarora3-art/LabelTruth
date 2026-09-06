import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  images: z.array(z.string().min(20)).min(1).max(3),
});

export type ClaimCheck = {
  claim: string;
  reality: string;
  verdict: "true" | "misleading" | "false";
};

export type AnalysisResult = {
  productName: string;
  category: string;
  verdict: "healthy" | "moderate" | "unhealthy";
  pcRatio: number;
  pcExplanation: string;
  trustScore: number;
  trustExplanation: string;
  confidence: "low" | "medium" | "high";
  confidenceExplanation: string;
  legibility: string[];
  claims: ClaimCheck[];
  redFlags: string[];
  greenFlags: string[];
  summary: string;
};

const SYSTEM = `You are a meticulous food label auditor. You receive one to three photos of the SAME packaged food item (front of pack, ingredient list, and/or nutrition panel).

WORK IN THIS ORDER, silently, before answering:
1. TRANSCRIBE what you can actually read: product name, net weight, serving size, servings per pack, and every nutrition value with its unit and basis (per 100g vs per serving). Read the ingredient list in order.
2. NORMALISE all nutrition figures to per 100g/100ml so comparisons are fair. If only per-serving values are printed, convert using the printed serving size and say so.
3. CHECK for the classic tricks: unrealistically small serving size, "per piece" bases, added-sugar synonyms (glucose syrup, maltodextrin, invert syrup, fruit juice concentrate, dextrose), protein claims met by low-quality or tiny amounts, "no added sugar" with high total sugar, palm/hydrogenated fat, high sodium, long additive lists, "natural"/"immunity"/"multigrain" halos with refined flour first, fortification used to distract from a poor base.
4. Only THEN score.

SCORING RULES
- pcRatio (Product-to-Claim ratio, 0.00-2.00): how far the product's real nutrition and ingredients deliver on the pack's own claims. 1.00 = fully lives up to the claims. Below 1.00 = the marketing over-promises. Above 1.00 = genuinely better than advertised. Anchor it: a pack with several misleading claims and refined/high-sugar composition lands 0.3-0.6; one honest minor stretch lands 0.85-0.95; a plain pack with strong nutrition lands 1.1-1.4. If a pack makes NO claims, judge it against the implicit claim of its category and say so.
- trustScore (0-100): how much a shopper should trust this pack's messaging, given the gap between claims and ingredients, serving-size games, hidden sugars and additive load.
- verdict: healthiness of eating this regularly.
- claims: every front-of-pack claim you can actually see, each with the concrete ingredient/nutrition reality and a verdict.
- confidence: "high" only when the ingredient list AND nutrition panel are legible; "medium" when one is partly readable or values are inferred; "low" when you are mostly working from the front of pack, blur, glare or a crop.
- confidenceExplanation: one or two sentences naming exactly what was and was not legible and what that means for the scores.
- legibility: short bullet strings for what you could/could not read (e.g. "Nutrition panel readable per 100g", "Ingredient list cut off after item 6").

HARD RULES
- Never invent a number. If a value is not visible, write "not visible" instead of guessing, and lower confidence.
- Quote real ingredient names and real figures you read.
- If the image is not a packaged food item, set productName to "Not a packaged food", confidence "low", and explain in summary.
Reply with JSON only.`;

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productName: { type: "string" },
    category: { type: "string" },
    verdict: { type: "string", enum: ["healthy", "moderate", "unhealthy"] },
    pcRatio: { type: "number" },
    pcExplanation: { type: "string" },
    trustScore: { type: "number" },
    trustExplanation: { type: "string" },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    confidenceExplanation: { type: "string" },
    legibility: { type: "array", items: { type: "string" } },
    claims: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          claim: { type: "string" },
          reality: { type: "string" },
          verdict: { type: "string", enum: ["true", "misleading", "false"] },
        },
        required: ["claim", "reality", "verdict"],
      },
    },
    redFlags: { type: "array", items: { type: "string" } },
    greenFlags: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
  },
  required: [
    "productName",
    "category",
    "verdict",
    "pcRatio",
    "pcExplanation",
    "trustScore",
    "trustExplanation",
    "confidence",
    "confidenceExplanation",
    "legibility",
    "claims",
    "redFlags",
    "greenFlags",
    "summary",
  ],
};

function retryDelayMs(response: Response, attempt: number): number {
  const retryAfter = response.headers.get("retry-after");
  const seconds = retryAfter ? Number(retryAfter) : Number.NaN;
  const delaySeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : 1.5 ** (attempt + 1);
  return Math.min(delaySeconds, 8) * 1000;
}

const AI_REQUEST_TIMEOUT_MS = 45_000;

const AI_REQUEST_TIMEOUT_MS = 45_000;

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("The scanner timed out waiting on the AI service. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function requestWithBoundedRetry(
  url: string,
  init: RequestInit,
): Promise<Response> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetchWithTimeout(url, init);
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt === 1) return response;
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs(response, attempt)));
  }

  throw new Error("The scanner could not reach the AI service.");
}
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function requestWithBoundedRetry(
  url: string,
  init: RequestInit,
): Promise<Response> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetchWithTimeout(url, init);
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt === 1) return response;
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs(response, attempt)));
  }

  throw new Error("The scanner could not reach the AI service.");
}

function errorMessageFromBody(raw: string): string | null {
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string } };
    return parsed.error?.message ?? null;
  } catch {
    return null;
  }
}

function parseModelJson(content: string): AnalysisResult {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(cleaned) as AnalysisResult;
}

function imagePart(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;,]+);base64,(.+)$/);
  if (!match) throw new Error("One of the uploaded photos could not be read.");
  return { inlineData: { mimeType: match[1], data: match[2] } };
}

export const analyzeLabel = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<AnalysisResult> => {
    const { resolveAiProvider } = await import("./ai-provider.server");
    const provider = resolveAiProvider();

    const userText = `Audit this packaged food using ${data.images.length} photo(s) of the same product. Transcribe the panel first, normalise to per 100g, then score. Return JSON only.`;
    const body =
      provider.transport === "gemini-content"
        ? {
            systemInstruction: { parts: [{ text: SYSTEM }] },
            contents: [
              {
                role: "user",
                parts: [{ text: userText }, ...data.images.map(imagePart)],
              },
            ],
            generationConfig: {
              temperature: 0.15,
              responseMimeType: "application/json",
            },
          }
        : {
            model: provider.model,
            temperature: 0.15,
            messages: [
              { role: "system", content: SYSTEM },
              {
                role: "user",
                content: [
                  { type: "text" as const, text: userText },
                  ...data.images.map((url) => ({
                    type: "image_url" as const,
                    image_url: { url },
                  })),
                ],
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: { name: "label_audit", strict: true, schema },
            },
          };

    const res = await requestWithBoundedRetry(provider.url, {
      method: "POST",
      headers: provider.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const raw = await res.text();
      const providerMessage = errorMessageFromBody(raw);
      if (res.status === 429) {
        if (provider.name === "gemini") {
          throw new Error(
            providerMessage ??
              "Gemini temporarily rate-limited the scanner. Check the Google AI Studio quota for this key, then try again.",
          );
        }
        throw new Error("The AI service is busy after a retry. Please try again shortly.");
      }
      if (res.status === 401 || res.status === 403) {
        if (provider.name === "gemini") {
          throw new Error(
            providerMessage ??
              "Gemini rejected this key. Check that the Generative Language API is enabled and that the Cloudflare secret is named GEMINI_API_KEY.",
          );
        }
        throw new Error(providerMessage ?? "The configured AI key was rejected.");
      }
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits to keep scanning.");
      throw new Error(providerMessage ?? `Scan failed (${res.status}).`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string | { text?: string }[] } }[];
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const openAiContent = json.choices?.[0]?.message?.content;
    const content =
      provider.transport === "gemini-content"
        ? json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("")
        : typeof openAiContent === "string"
          ? openAiContent
          : openAiContent?.map((part) => part.text ?? "").join("");
    if (!content) throw new Error("The scanner returned an empty result.");

    const parsed = parseModelJson(content);
    parsed.pcRatio = Math.max(0, Math.min(2, Number(parsed.pcRatio) || 0));
    parsed.trustScore = Math.max(0, Math.min(100, Math.round(Number(parsed.trustScore) || 0)));
    if (!["low", "medium", "high"].includes(parsed.confidence)) parsed.confidence = "medium";
    if (!Array.isArray(parsed.legibility)) parsed.legibility = [];
    return parsed;
  });
