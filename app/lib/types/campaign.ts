// app/lib/types/campaign.ts
export type CampaignType = 'audience' | 'product';

export interface UserContext {
  campaignType: CampaignType;
  description: string;
  industry?: string;
}
