export enum ContributionType {
  CODE = 'code',
  DESIGN = 'design',
  DOC = 'doc',
  OPERATION = 'operation',
  OTHER = 'other'
}

export interface ContributionRecord {
  id: string;
  timestamp: number;
  contributorAddress: string;
  nickname: string;
  contributionType: ContributionType;
  details: string;
  hours: number;
} 