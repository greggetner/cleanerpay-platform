import Anthropic from "@anthropic-ai/sdk";
import type { Classification } from "./classifier";
import type { Tier, PropertyStats } from "./tiers";
import { MAX_QUARTERLY_PER_CLEANER } from "./tiers";

export type EmailContext = {
  propertyName: string;
  guestName: string;
  cleanliness: number | null;
  publicReview: string;
  privateFeedback: string;
  classification: Classification;
  propertyStats: PropertyStats;
  propertyTier: Tier;
  projectedTotal: number;
  quarterLabel: string;
};

export type GeneratedEmail = {
  subject: string;
  body: string;
};

export async function writeEmail(
  anthropic: Anthropic,
  ctx: EmailContext,
): Promise<GeneratedEmail> {
  const cleanlinessStr = ctx.cleanliness == null ? "n/a" : String(ctx.cleanliness);
  const prompt = `Write a very short email to John and Tess, our cleaners. Phone-friendly, 4 to 6 short lines, no fluff, no sales language. Do NOT use em dashes anywhere in subject or body.

Facts:
- Property: ${ctx.propertyName}
- Guest: ${ctx.guestName}
- Cleanliness score: ${cleanlinessStr}/5
- Public review: ${ctx.publicReview || "(none)"}
- Private feedback: ${ctx.privateFeedback || "(none)"}
- Complaint classification: ${ctx.classification.flag}${ctx.classification.type ? ": " + ctx.classification.type : ""}
- ${ctx.quarterLabel} projected total across all 3 properties: $${ctx.projectedTotal} of $${MAX_QUARTERLY_PER_CLEANER}

Format exactly:
Line 1: "Hi John and Tess,"
Line 2: "<Guest first name> left a <score>/5 cleanliness review for <Property>."
Line 3: If there's specific cleanliness feedback in public review or private feedback, quote the relevant phrase briefly. Otherwise a short positive line.
Line 4: "${ctx.quarterLabel} projected: $${ctx.projectedTotal} of $${MAX_QUARTERLY_PER_CLEANER}."
Line 5: One short encouraging sentence. If 5/5, celebrate. If issues, name the fix kindly.
Line 6: "Greg"

Do NOT include per-property breakdowns, next check-in details, or bonus tier rules. Keep it tight. Never use em dashes. Use periods, commas, semicolons, or colons instead.

Subject format exactly: "${ctx.propertyName}. ⭐ ${cleanlinessStr}/5 cleanliness. ${ctx.quarterLabel} ${ctx.propertyTier.emoji}"

Return ONLY a JSON object:
{"subject":"...","body":"..."}`;

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });
  const block = msg.content[0];
  const text = block && block.type === "text" ? block.text.trim() : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Email generator returned unparseable output");
  return JSON.parse(jsonMatch[0]) as GeneratedEmail;
}
