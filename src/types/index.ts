export interface Question {
  id: string | number;
  text: string;
  type: 'text' | 'number' | 'single' | 'multi' | 'vote' | 'poll';
  options?: string[];
  required: boolean;
  votes?: { [option: string]: number };
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed';
  questions: Question[];
  responses: number;
  createdAt: string;
  type?: 'customer' | 'employee' | 'product' | 'market' | 'other';
}

export interface SurveyFormData {
  title: string;
  description: string;
  type: string;
}

export interface DashboardStats {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  completionRate: number;
}

export interface VoteResult {
  option: string;
  votes: number;
  percentage: number;
}