import type { UserContext } from "@/app/lib/types/campaign";

interface AudienceOutput {
  sample_size: string;
  conversion_rate: string;
  ltv_multiple: string;
}

interface ProductOutput {
  swag_items: string[];
}

export type FormOutput = AudienceOutput | ProductOutput;


export function buildOgUrl(
  formOutput: AudienceOutput | ProductOutput,
  userContext: UserContext
) {
  const params = new URLSearchParams();

  params.set("campaignType", userContext.campaignType);
  params.set("industry", userContext.industry || "CPG");

  if (userContext.campaignType === "audience") {
    const output = formOutput as AudienceOutput;
    params.set("sampleSize", output.sample_size);
    params.set("conversion", output.conversion_rate);
    params.set("ltv", output.ltv_multiple);
  }

  if (userContext.campaignType === "product") {
    const output = formOutput as any;

    const items: string[] = Array.isArray(output?.swag_items)
      ? output.swag_items
      : [output?.item_1, output?.item_2, output?.item_3, output?.item_4, output?.item_5].filter(Boolean);
    
    params.set("items", items.join(","));
  }
  console.log('URL --> ',`/api/og?${params.toString()}`)
  return `/api/og?${params.toString()}`;
}
