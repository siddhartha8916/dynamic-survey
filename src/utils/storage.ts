import type { Survey } from '../types';

const STORAGE_KEY = 'surveys';

export const surveyStorage = {
  getSurveys(): Survey[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading surveys from localStorage:', error);
      return [];
    }
  },

  saveSurveys(surveys: Survey[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(surveys));
    } catch (error) {
      console.error('Error saving surveys to localStorage:', error);
    }
  },

  getSurveyById(id: string): Survey | undefined {
    const surveys = this.getSurveys();
    return surveys.find(survey => survey.id === id);
  },

  addSurvey(survey: Survey): void {
    const surveys = this.getSurveys();
    surveys.push(survey);
    this.saveSurveys(surveys);
  },

  updateSurvey(updatedSurvey: Survey): void {
    const surveys = this.getSurveys();
    const index = surveys.findIndex(survey => survey.id === updatedSurvey.id);
    if (index !== -1) {
      surveys[index] = updatedSurvey;
      this.saveSurveys(surveys);
    }
  },

  deleteSurvey(id: string): void {
    const surveys = this.getSurveys();
    const filteredSurveys = surveys.filter(survey => survey.id !== id);
    this.saveSurveys(filteredSurveys);
  },

  duplicateSurvey(id: string): Survey | null {
    const survey = this.getSurveyById(id);
    if (!survey) return null;

    const duplicate: Survey = {
      ...survey,
      id: Date.now().toString(),
      title: `${survey.title} (Copy)`,
      status: 'draft',
      responses: 0,
      createdAt: new Date().toISOString(),
    };

    this.addSurvey(duplicate);
    return duplicate;
  }
};

// Initialize with sample data if no surveys exist
export const initializeSampleData = (): void => {
  const surveys = surveyStorage.getSurveys();
  
  if (surveys.length === 0) {
    const sampleSurveys: Survey[] = [
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
    
    surveyStorage.saveSurveys(sampleSurveys);
  }
};