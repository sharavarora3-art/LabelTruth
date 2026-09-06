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
- confidenceExplanation: one or two sentences naming exactly what was and
