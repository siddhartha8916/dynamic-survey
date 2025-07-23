// Survey Creator App - Edit Survey JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const backToDetailsLink = document.getElementById('backToDetailsLink');
    const saveSurveyInfoBtn = document.getElementById('saveSurveyInfoBtn');
    const surveyTitleInput = document.getElementById('surveyTitle');
    const surveyDescriptionInput = document.getElementById('surveyDescription');
    const surveyStatusSelect = document.getElementById('surveyStatus');

    // Get survey ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('id');

    // Load survey data
    let survey = null;
    loadSurveyData();

    // Event listeners
    saveSurveyInfoBtn.addEventListener('click', saveSurveyChanges);
    
    // Update back link
    backToDetailsLink.href = `survey-details.html?id=${surveyId}`;

    // Functions
    function loadSurveyData() {
        // In a real app, this would be an API call
        // For now, we'll use localStorage
        const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
        survey = surveys.find(s => s.id === surveyId);
        
        if (!survey) {
            // Survey not found
            alert('Survey not found');
            window.location.href = '../index.html';
            return;
        }
        
        // Populate form with survey data
        surveyTitleInput.value = survey.title;
        surveyDescriptionInput.value = survey.description || '';
        surveyStatusSelect.value = survey.status;
        
        // Set document title
        document.title = `Edit: ${survey.title}`;
    }

    function saveSurveyChanges() {
        const title = surveyTitleInput.value.trim();
        
        if (!title) {
            alert('Please enter a survey title');
            return;
        }
        
        // Update survey data
        survey.title = title;
        survey.description = surveyDescriptionInput.value.trim();
        survey.status = surveyStatusSelect.value;
        
        // Save to localStorage
        const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
        const surveyIndex = surveys.findIndex(s => s.id === surveyId);
        
        if (surveyIndex !== -1) {
            surveys[surveyIndex] = survey;
            localStorage.setItem('surveys', JSON.stringify(surveys));
            
            // Navigate back to survey details
            window.location.href = `survey-details.html?id=${surveyId}`;
        } else {
            alert('Error saving survey');
        }
    }
});
