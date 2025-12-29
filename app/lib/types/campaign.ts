// app/lib/types/campaign.ts
export type CampaignType = 'Audience' | 'Product';

export interface UserContext {
  campaignType: CampaignType;
  description: string;
  industry?: string;
}
