// Survey Creator App - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const createSurveyBtn = document.getElementById('createSurveyBtn');
    const createSurveyModal = document.getElementById('createSurveyModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelSurveyBtn = document.getElementById('cancelSurveyBtn');
    const goToCreateQuestionsBtn = document.getElementById('goToCreateQuestionsBtn');

    
    // Load surveys from localStorage
    let surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    
    // If no surveys in localStorage, use sample data
    if (surveys.length === 0) {
        surveys = [
            {
                id: '1',
                title: 'Customer Feedback',
                description: 'A survey to gather feedback about our customer service and product quality.',
                status: 'active',
                questions: [
                    {id: 1, text: 'How would you rate our customer service?', type: 'single', required: true, options: ['Excellent', 'Good', 'Average', 'Poor', 'Very poor']},
                    {id: 2, text: 'What aspects of our product do you like the most?', type: 'text', required: false}
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
                    {id: 1, text: 'How satisfied are you with your job?', type: 'single', required: true, options: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied']},
                    {id: 2, text: 'What improvements would you suggest for the workplace?', type: 'text', required: false},
                    {id: 3, text: 'Which benefits are most important to you?', type: 'multi', required: true, options: ['Health insurance', 'Retirement plan', 'Paid time off', 'Remote work options', 'Professional development']}
                ],
                responses: 0,
                createdAt: '2025-07-20T15:30:00Z'
            }
        ];
        
        // Save sample data to localStorage
        localStorage.setItem('surveys', JSON.stringify(surveys));
    }

    // Event listeners
    createSurveyBtn.addEventListener('click', openCreateSurveyModal);
    closeModalBtn.addEventListener('click', closeCreateSurveyModal);
    cancelSurveyBtn.addEventListener('click', closeCreateSurveyModal);
    goToCreateQuestionsBtn.addEventListener('click', goToCreateQuestions);

    // Functions
    function openCreateSurveyModal() {
        createSurveyModal.classList.remove('hidden');
        createSurveyModal.classList.add('flex');

    }

    function closeCreateSurveyModal() {
        createSurveyModal.classList.add('hidden');
        // Reset form fields
        document.getElementById('surveyTitle').value = '';
        document.getElementById('surveyDescription').value = '';
    }

    function goToCreateQuestions() {
        const title = document.getElementById('surveyTitle').value;
        const description = document.getElementById('surveyDescription').value;
        
        if (!title) {
            alert('Please enter a survey title');
            return;
        }
        
        // In a real app, you would save this to the database
        // For now, we'll just redirect to the create questions page with params
        const newSurveyId = Date.now(); // Generate a temporary ID
        const params = new URLSearchParams({
            id: newSurveyId,
            title: title,
            description: description
        });
        
        window.location.href = `pages/create-questions.html?${params.toString()}`;
    }

    // Check if we should show the empty state
    function checkEmptyState() {
        const surveyCards = document.getElementById('surveyCards');
        const emptySurveyState = document.getElementById('emptySurveyState');
        
        if (surveys.length === 0) {
            surveyCards.classList.add('hidden');
            emptySurveyState.classList.remove('hidden');
        } else {
            surveyCards.classList.remove('hidden');
            emptySurveyState.classList.add('hidden');
            renderSurveys(); // Render surveys if we have them
        }
    }
    
    // Render surveys in the UI
    function renderSurveys() {
        const surveyCards = document.getElementById('surveyCards');
        surveyCards.innerHTML = ''; // Clear existing cards
        
        surveys.forEach(survey => {
            // Format date
            const createdDate = new Date(survey.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Get icon based on survey type or title
            let iconClass = 'bx-user-voice';
            if (survey.title.toLowerCase().includes('employee')) {
                iconClass = 'bx-building-house';
            } else if (survey.title.toLowerCase().includes('product')) {
                iconClass = 'bx-package';
            } else if (survey.title.toLowerCase().includes('market')) {
                iconClass = 'bx-bar-chart-alt-2';
            }
            
            // Create card
            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group';
            card.innerHTML = `
                <div class="p-5">
                    <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center">
                            <div class="p-2 rounded-lg bg-primary bg-opacity-10 mr-3">
                                <i class='bx ${iconClass} text-lg text-primary'></i>
                            </div>
                            <h3 class="text-lg font-semibold text-primary group-hover:text-primary">${survey.title}</h3>
                        </div>
                        <span class="${getStatusClass(survey.status)}">${capitalize(survey.status)}</span>
                    </div>
                    <p class="text-medium mb-5 line-clamp-2">${survey.description || 'No description provided.'}</p>
                    <div class="flex justify-between text-sm text-medium">
                        <div class="flex items-center">
                            <i class='bx bx-help-circle text-lg mr-1'></i>
                            <span>${survey.questions ? survey.questions.length : 0} Questions</span>
                        </div>
                        <div class="flex items-center">
                            <i class='bx bx-message-square text-lg mr-1'></i>
                            <span>${survey.responses || 0} Responses</span>
                        </div>
                    </div>
                </div>
                <div class="bg-light px-5 py-3.5 flex justify-between items-center">
                    <span class="text-sm text-medium">Created: ${createdDate}</span>
                    <div class="flex space-x-3">
                        <button class="edit-survey text-medium hover:text-primary" data-id="${survey.id}">
                            <i class='bx bx-edit-alt text-lg'></i>
                        </button>
                        <button class="duplicate-survey text-medium hover:text-primary" data-id="${survey.id}">
                            <i class='bx bx-duplicate text-lg'></i>
                        </button>
                        <button class="delete-survey text-medium hover:text-red-600" data-id="${survey.id}">
                            <i class='bx bx-trash text-lg'></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Add card to container
            surveyCards.appendChild(card);
            
            // Add event listener to view the survey
            card.addEventListener('click', function(e) {
                // Don't navigate if user clicked on a button
                if (e.target.closest('button')) return;
                
                window.location.href = `pages/survey-details.html?id=${survey.id}`;
            });
        });
        
        // Add event listeners for buttons
        document.querySelectorAll('.edit-survey').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = `pages/edit-survey.html?id=${btn.dataset.id}`;
            });
        });
        
        document.querySelectorAll('.duplicate-survey').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                duplicateSurvey(btn.dataset.id);
            });
        });
        
        document.querySelectorAll('.delete-survey').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSurvey(btn.dataset.id);
            });
        });
    }
    
    // Helper functions for survey rendering
    function getStatusClass(status) {
        switch(status) {
            case 'active': return 'bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium';
            case 'draft': return 'bg-yellow-100 text-yellow-700 text-xs px-2.5 py-1 rounded-full font-medium';
            case 'closed': return 'bg-secondary bg-opacity-10 text-secondary text-xs px-2.5 py-1 rounded-full font-medium';
            default: return 'bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium';
        }
    }
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Initialize the homepage
    checkEmptyState();

    // Utility functions for survey operations
    function duplicateSurvey(id) {
        // Get surveys from localStorage
        const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
        const survey = surveys.find(s => s.id === id);
        
        if (survey) {
            const duplicate = { 
                ...survey,
                id: Date.now().toString(), // Generate a new ID as a string
                title: `${survey.title} (Copy)`,
                status: 'draft',
                responses: 0,
                createdAt: new Date().toISOString()
            };
            
            surveys.push(duplicate);
            localStorage.setItem('surveys', JSON.stringify(surveys));
            
            // Refresh the UI
            window.location.reload();
        }
    }

    function deleteSurvey(id) {
        if (confirm('Are you sure you want to delete this survey?')) {
            // Get surveys from localStorage
            let surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
            
            // Filter out the survey to delete
            surveys = surveys.filter(s => s.id !== id);
            
            // Save the updated surveys array
            localStorage.setItem('surveys', JSON.stringify(surveys));
            
            // Refresh the UI
            window.location.reload();
        }
    }
});
