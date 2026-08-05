import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  imageDataUrl: z.string().min(20),
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
  claims: ClaimCheck[];
  redFlags: string[];
  greenFlags: string[];
  summary: string;
};

const SYSTEM = `You are a food label auditor. You are shown a photo of a packaged food item (front of pack and/or nutrition panel).

Score it with the P:C ratio (Product-to-Claim ratio): how much the ACTUAL nutritional substance of the product delivers on what the PACKAGING CLAIMS.
- pcRatio is a number from 0.0 to 2.0. 1.0 = the product exactly lives up to its claims. Below 1.0 = the marketing over-promises versus the real ingredients/nutrition. Above 1.0 = the product is genuinely better than it advertises.
- trustScore is 0-100: how much a shopper should trust this pack's messaging (claims vs ingredient list, hidden sugars, fake "natural"/"protein"/"sugar-free" halos, tiny serving-size tricks, additive load).
- verdict: overall healthiness of eating this regularly.
- claims: each front-of-pack claim you can see, with what the ingredients/nutrition actually show, and a verdict.
- If the image is not a packaged food item, set productName to "Not a packaged food" and explain in summary.
Be concrete, name ingredients and numbers you can read. Never invent numbers you cannot see; say "not visible" instead.
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
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "text", text: "Audit this packaged food. Return JSON." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
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
    return parsed;
  });
