import { useState, useEffect } from 'react';
import type { Survey } from '../types';
import { surveyStorage, initializeSampleData } from '../utils/storage';

export const useSurveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data if needed
    initializeSampleData();
    
    // Load surveys
    const loadedSurveys = surveyStorage.getSurveys();
    setSurveys(loadedSurveys);
    setLoading(false);
  }, []);

  const addSurvey = (survey: Survey) => {
    surveyStorage.addSurvey(survey);
    setSurveys(surveyStorage.getSurveys());
  };

  const updateSurvey = (survey: Survey) => {
    surveyStorage.updateSurvey(survey);
    setSurveys(surveyStorage.getSurveys());
  };

  const deleteSurvey = (id: string) => {
    surveyStorage.deleteSurvey(id);
    setSurveys(surveyStorage.getSurveys());
  };

  const duplicateSurvey = (id: string) => {
    const duplicate = surveyStorage.duplicateSurvey(id);
    if (duplicate) {
      setSurveys(surveyStorage.getSurveys());
      return duplicate;
    }
    return null;
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
    getSurveyById,
  };
};