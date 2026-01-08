export type CampaignType = 'audience' | 'product';

export interface UserContext {
  campaignType: CampaignType;
  description: string;
  industry?: string;
  email:string;
}

export interface PreviewContext {
  campaignType: CampaignType;
  description: string;
  industry?: string;
  email:string;
}
