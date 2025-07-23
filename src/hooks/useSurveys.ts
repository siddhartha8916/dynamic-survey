import { useState, useEffect } from 'react';
import type { Survey } from '../types/survey';

// Initial sample data matching the original application
const INITIAL_SURVEYS: Survey[] = [
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

export const useSurveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  // Load surveys from localStorage on mount
  useEffect(() => {
    const savedSurveys = localStorage.getItem('surveys');
    if (savedSurveys) {
      try {
        const parsed = JSON.parse(savedSurveys);
        setSurveys(parsed);
      } catch (error) {
        console.error('Error parsing surveys from localStorage:', error);
        setSurveys(INITIAL_SURVEYS);
        localStorage.setItem('surveys', JSON.stringify(INITIAL_SURVEYS));
      }
    } else {
      setSurveys(INITIAL_SURVEYS);
      localStorage.setItem('surveys', JSON.stringify(INITIAL_SURVEYS));
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever surveys change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('surveys', JSON.stringify(surveys));
    }
  }, [surveys, loading]);

  const addSurvey = (survey: Survey) => {
    setSurveys(prev => [...prev, survey]);
  };

  const updateSurvey = (id: string, updatedSurvey: Partial<Survey>) => {
    setSurveys(prev => 
      prev.map(survey => 
        survey.id === id ? { ...survey, ...updatedSurvey } : survey
      )
    );
  };

  const deleteSurvey = (id: string) => {
    setSurveys(prev => prev.filter(survey => survey.id !== id));
  };

  const duplicateSurvey = (id: string) => {
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
      addSurvey(duplicate);
    }
  };

  const getSurveyById = (id: string): Survey | undefined => {
    return surveys.find(survey => survey.id === id);
  };

  return {
    surveys,
    loading,
    addSurvey,
    updateSurvey,
    deleteSurvey,
    duplicateSurvey,
    getSurveyById
  };
};