// TypeScript interfaces for the survey application

export interface Question {
  id: number;
  text: string;
  type: 'text' | 'number' | 'single' | 'multi';
  required: boolean;
  options?: string[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'closed';
  questions: Question[];
  responses: number;
  createdAt: string;
}

export interface SurveyFormData {
  title: string;
  description: string;
  type: 'customer' | 'employee' | 'product' | 'market' | 'other';
}

export interface QuestionFormData {
  text: string;
  type: 'text' | 'number' | 'single' | 'multi';
  required: boolean;
  options: string[];
}