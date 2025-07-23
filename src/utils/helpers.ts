import { Survey, DashboardStats } from '../types';

export const generateId = (): string => {
  return Date.now().toString();
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getQuestionTypeLabel = (type: string): string => {
  switch(type) {
    case 'text': return 'Text Question';
    case 'number': return 'Number Input';
    case 'single': return 'Single Select';
    case 'multi': return 'Multiple Choice';
    case 'vote': return 'Vote Question';
    case 'poll': return 'Poll Question';
    default: return type;
  }
};

export const calculateDashboardStats = (surveys: Survey[]): DashboardStats => {
  const totalSurveys = surveys.length;
  const activeSurveys = surveys.filter(s => s.status === 'active').length;
  const totalResponses = surveys.reduce((sum, survey) => sum + survey.responses, 0);
  const completionRate = surveys.length > 0 ? Math.round((activeSurveys / totalSurveys) * 100) : 0;

  return {
    totalSurveys,
    activeSurveys,
    totalResponses,
    completionRate
  };
};