import { UserContext } from "../types/campaign";

export function audiencePrompt(ctx: UserContext) {
  return `
User is in the ${ctx.industry} industry.

Context:
${ctx.description}

Return JSON ONLY with:
{
  "sample_size": "number range",
  "conversion_rate": "percentage range",
  "ltv_multiple": "multiplier range"
}

No explanations. No markdown.
`.trim();
}

export function productPrompt(ctx: UserContext) {
  return `
User is in the ${ctx.industry} industry.

Audience / Context:
${ctx.description}

Suggest 5 branded swag items for a gift box.

Return JSON ONLY with:
{
  "item_1": "string",
  "item_2": "string",
  "item_3": "string",
  "item_4": "string",
  "item_5": "string"
}

No explanations. No markdown.
`.trim();
}
