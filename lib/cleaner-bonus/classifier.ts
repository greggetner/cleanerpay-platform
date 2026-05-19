import Anthropic from "@anthropic-ai/sdk";

export type ClassificationFlag = "none" | "minor" | "major" | "flag";

export type Classification = {
  flag: ClassificationFlag;
  type: string;
};

export async function classifyComplaint(
  anthropic: Anthropic,
  publicReview: string,
  privateFeedback: string,
): Promise<Classification> {
  const prompt = `You classify cleaning-related signals in short-term-rental reviews.

Choose exactly one: none, minor, major, flag.

MAJOR — cleanliness issue that affects the stay or risks a public complaint:
- visible dirt/grime/stains on surfaces/linens/towels
- previous guest items left behind
- odors (musty, smoke, pet)
- unsanitary bathroom (mold, residue, unflushed)
- used or stained linens
- bugs or pests
- hot tub not clean or ready
- cleanliness mentioned negatively in the PUBLIC review

MINOR — a detail a picky guest notices, unlikely to affect stay:
- dust under furniture or behind headboards
- streaks on mirrors or glass
- hair in shower drain
- crumbs in appliances or drawers
- fingerprints on fixtures
- missed corners or baseboards

NONE — no cleanliness complaint, or guest praises cleanliness

FLAG — contradictory signals, unclear cause, guest sounds upset without specific cause

Respond with ONLY a JSON object, no prose:
{"flag":"none|minor|major|flag","type":"short description or empty string"}

Public review:
${publicReview || "(none)"}

Private feedback:
${privateFeedback || "(none)"}`;

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });
  const block = msg.content[0];
  const text = block && block.type === "text" ? block.text.trim() : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { flag: "flag", type: "classifier parse error" };
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    const flag: ClassificationFlag = (["none", "minor", "major", "flag"] as const).includes(
      parsed.flag,
    )
      ? parsed.flag
      : "flag";
    return { flag, type: typeof parsed.type === "string" ? parsed.type : "" };
  } catch {
    return { flag: "flag", type: "classifier parse error" };
  }
}
