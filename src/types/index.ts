export type QuestionType = 'text' | 'number' | 'single' | 'multi';
export type SurveyStatus = 'active' | 'draft' | 'closed';
export type DeploymentType = 'pwa' | 'browser' | 'whatsapp';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  questions?: Question[];
  responses: number;
  createdAt: string;
}

export interface SurveyFormData {
  title: string;
  description: string;
  type: string;
}

export interface QuestionFormData {
  text: string;
  type: QuestionType;
  options: string[];
  required: boolean;
}