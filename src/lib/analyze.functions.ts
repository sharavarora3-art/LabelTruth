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

export const analyzeLabel = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<AnalysisResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured yet.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        temperature: 0.15,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Audit this packaged food using ${data.images.length} photo(s) of the same product. Transcribe the panel first, normalise to per 100g, then score. Return JSON only.`,
              },
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
      }),
    });

    if (res.status === 429) throw new Error("Too many scans right now — try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits to keep scanning.");
    if (!res.ok) throw new Error(`Scan failed (${res.status}): ${await res.text()}`);

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("The scanner returned an empty result.");

    const parsed = JSON.parse(content) as AnalysisResult;
    parsed.pcRatio = Math.max(0, Math.min(2, Number(parsed.pcRatio) || 0));
    parsed.trustScore = Math.max(0, Math.min(100, Math.round(Number(parsed.trustScore) || 0)));
    if (!["low", "medium", "high"].includes(parsed.confidence)) parsed.confidence = "medium";
    if (!Array.isArray(parsed.legibility)) parsed.legibility = [];
    return parsed;
  });
