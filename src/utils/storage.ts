import { Survey } from '../types';

const STORAGE_KEY = 'surveys';

export const getSurveys = (): Survey[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Return sample data if nothing in localStorage
    const sampleData: Survey[] = [
      {
        id: '1',
        title: 'Customer Feedback',
        description: 'A survey to gather feedback about our customer service and product quality.',
        status: 'active',
        questions: [
          {
            id: 1,
            text: 'How would you rate our customer service?',
            type: 'single',
            required: true,
            options: ['Excellent', 'Good', 'Average', 'Poor', 'Very poor']
          },
          {
            id: 2,
            text: 'What aspects of our product do you like the most?',
            type: 'text',
            required: false
          }
        ],
        responses: 64,
        createdAt: '2025-07-10T12:00:00Z'
      },
      {
        id: '2',
        title: 'Employee Satisfaction',
        description: 'Annual employee satisfaction and engagement survey.',
        status: 'draft',
        questions: [
          {
            id: 1,
            text: 'How satisfied are you with your job?',
            type: 'single',
            required: true,
            options: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied']
          },
          {
            id: 2,
            text: 'What improvements would you suggest for the workplace?',
            type: 'text',
            required: false
          },
          {
            id: 3,
            text: 'Which benefits are most important to you?',
            type: 'multi',
            required: true,
            options: ['Health insurance', 'Retirement plan', 'Paid time off', 'Remote work options', 'Professional development']
          }
        ],
        responses: 0,
        createdAt: '2025-07-20T15:30:00Z'
      }
    ];
    
    saveSurveys(sampleData);
    return sampleData;
  } catch (error) {
    console.error('Error loading surveys:', error);
    return [];
  }
};

export const saveSurveys = (surveys: Survey[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(surveys));
  } catch (error) {
    console.error('Error saving surveys:', error);
  }
};

export const getSurveyById = (id: string): Survey | undefined => {
  const surveys = getSurveys();
  return surveys.find(survey => survey.id === id);
};

export const deleteSurvey = (id: string): void => {
  const surveys = getSurveys();
  const filtered = surveys.filter(survey => survey.id !== id);
  saveSurveys(filtered);
};

export const duplicateSurvey = (id: string): Survey | null => {
  const surveys = getSurveys();
  const survey = surveys.find(s => s.id === id);
  
  if (survey) {
    const duplicate: Survey = {
      ...survey,
      id: Date.now().toString(),
      title: `${survey.title} (Copy)`,
      status: 'draft',
      responses: 0,
      createdAt: new Date().toISOString()
    };
    
    surveys.push(duplicate);
    saveSurveys(surveys);
    return duplicate;
  }
  
  return null;
};