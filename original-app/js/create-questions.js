// Survey Creator App - Create Questions JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals if function exists
    if (typeof initModals === 'function') {
        initModals();
    }
    
    // DOM elements
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const addQuestionModal = document.getElementById('addQuestionModal');
    const closeQuestionModalBtn = document.getElementById('closeQuestionModalBtn');
    const cancelQuestionBtn = document.getElementById('cancelQuestionBtn');
    const saveQuestionBtn = document.getElementById('saveQuestionBtn');
    const questionType = document.getElementById('questionType');
    const optionsContainer = document.getElementById('optionsContainer');
    const addOptionBtn = document.getElementById('addOptionBtn');
    const saveSurveyBtn = document.getElementById('saveSurveyBtn');
    const questionsContainer = document.getElementById('questionsContainer');

    // Get survey details from URL
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('id');
    const surveyTitle = urlParams.get('title');
    const surveyDescription = urlParams.get('description');

    // Display survey title
    document.getElementById('surveyTitle').textContent = surveyTitle || 'New Survey';
    document.title = `${surveyTitle || 'New Survey'} - Questions`;

    // Store questions for this survey
    let questions = [];
    // If editing an existing survey, we would load questions here
    let editingQuestionIndex = null;

    // Event listeners
    addQuestionBtn.addEventListener('click', openAddQuestionModal);
    closeQuestionModalBtn.addEventListener('click', closeAddQuestionModal);
    cancelQuestionBtn.addEventListener('click', closeAddQuestionModal);
    questionType.addEventListener('change', toggleOptionsContainer);
    addOptionBtn.addEventListener('click', addOption);
    saveQuestionBtn.addEventListener('click', saveQuestion);
    saveSurveyBtn.addEventListener('click', saveSurvey);

    // Functions
    function openAddQuestionModal() {
        editingQuestionIndex = null;
        document.getElementById('questionText').value = '';
        document.getElementById('questionType').value = 'text';
        document.getElementById('requiredQuestion').checked = false;
        
        // Reset options
        const optionsList = document.getElementById('optionsList');
        optionsList.innerHTML = `
            <div class="option-item flex items-center">
                <input type="text" class="option-input w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Option 1">
                <button type="button" class="ml-2 text-red-500 hover:text-red-700 remove-option hidden p-1">
                    <i class='bx bx-trash text-lg'></i>
                </button>
            </div>
            <div class="option-item flex items-center">
                <input type="text" class="option-input w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Option 2">
                <button type="button" class="ml-2 text-red-500 hover:text-red-700 remove-option hidden p-1">
                    <i class='bx bx-trash text-lg'></i>
                </button>
            </div>
        `;
        
        // Update button text for adding a new question
        saveQuestionBtn.textContent = 'Add Question';
        
        // Hide options container initially
        optionsContainer.classList.add('hidden');
        
        // Show the modal using modal helper
        if (typeof showModal === 'function') {
            showModal('addQuestionModal');
        } else {
            addQuestionModal.classList.remove('hidden');
            addQuestionModal.classList.add('flex');
        }
    }

    function closeAddQuestionModal() {
        if (typeof hideModal === 'function') {
            hideModal('addQuestionModal');
        } else {
            addQuestionModal.classList.add('hidden');
            addQuestionModal.classList.remove('flex');
        }
    }

    function toggleOptionsContainer() {
        if (questionType.value === 'single' || questionType.value === 'multi') {
            optionsContainer.classList.remove('hidden');
        } else {
            optionsContainer.classList.add('hidden');
        }
    }

    function addOption() {
        const optionsList = document.getElementById('optionsList');
        const optionCount = optionsList.children.length + 1;
        
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item flex items-center';
        optionDiv.innerHTML = `
            <input type="text" class="option-input w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Option ${optionCount}">
            <button type="button" class="ml-2 text-red-500 hover:text-red-700 remove-option">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        `;
        
        optionsList.appendChild(optionDiv);
        
        // Add event listener to the remove button
        optionDiv.querySelector('.remove-option').addEventListener('click', function() {
            optionsList.removeChild(optionDiv);
            updateRemoveButtons();
        });
        
        updateRemoveButtons();
    }

    function updateRemoveButtons() {
        const optionItems = document.querySelectorAll('.option-item');
        
        optionItems.forEach((item, index) => {
            const removeBtn = item.querySelector('.remove-option');
            
            if (optionItems.length <= 2) {
                removeBtn.classList.add('hidden');
            } else {
                removeBtn.classList.remove('hidden');
            }
        });
    }

    function saveQuestion() {
        const questionText = document.getElementById('questionText').value;
        const questionTypeValue = document.getElementById('questionType').value;
        const isRequired = document.getElementById('requiredQuestion').checked;
        
        if (!questionText) {
            alert('Please enter the question text');
            return;
        }
        
        let options = [];
        if (questionTypeValue === 'single' || questionTypeValue === 'multi') {
            const optionInputs = document.querySelectorAll('.option-input');
            
            optionInputs.forEach(input => {
                if (input.value.trim()) {
                    options.push(input.value.trim());
                }
            });
            
            if (options.length < 2) {
                alert('Please add at least two options');
                return;
            }
        }
        
        const question = {
            id: editingQuestionIndex !== null ? questions[editingQuestionIndex].id : Date.now(),
            text: questionText,
            type: questionTypeValue,
            options: options,
            required: isRequired
        };
        
        if (editingQuestionIndex !== null) {
            // Update existing question
            questions[editingQuestionIndex] = question;
        } else {
            // Add new question
            questions.push(question);
        }
        
        // Close modal
        closeAddQuestionModal();
        
        // Update the UI
        renderQuestions();
    }

    function renderQuestions() {
        if (questions.length === 0) {
            questionsContainer.innerHTML = `
                <div class="border rounded-lg p-4 bg-gray-50">
                    <div class="flex justify-between mb-2">
                        <h3 class="font-medium">No questions added yet</h3>
                    </div>
                    <p class="text-gray-600 text-sm">Click "Add Question" to create your first question</p>
                </div>
            `;
            return;
        }
        
        questionsContainer.innerHTML = '';
        
        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'border rounded-lg p-4 bg-white hover:shadow-md transition';
            
            let optionsHtml = '';
            if (question.options && question.options.length > 0) {
                optionsHtml = '<div class="mt-2">';
                
                if (question.type === 'single') {
                    question.options.forEach(option => {
                        optionsHtml += `
                            <div class="flex items-center mt-1">
                                <span class="w-4 h-4 border border-gray-400 rounded-full mr-2"></span>
                                <span class="text-gray-700">${option}</span>
                            </div>
                        `;
                    });
                } else if (question.type === 'multi') {
                    question.options.forEach(option => {
                        optionsHtml += `
                            <div class="flex items-center mt-1">
                                <span class="w-4 h-4 border border-gray-400 rounded mr-2"></span>
                                <span class="text-gray-700">${option}</span>
                            </div>
                        `;
                    });
                }
                
                optionsHtml += '</div>';
            }
            
            questionDiv.innerHTML = `
                <div class="flex justify-between">
                    <div>
                        <div class="flex items-center mb-1">
                            <h3 class="font-medium">${question.text}</h3>
                            ${question.required ? '<span class="ml-2 text-red-500 text-sm">*</span>' : ''}
                        </div>
                        <p class="text-gray-500 text-sm">
                            ${getQuestionTypeLabel(question.type)}
                        </p>
                    </div>
                    <div class="flex space-x-2">
                        <button class="edit-question text-indigo-600 hover:text-indigo-800" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button class="duplicate-question text-indigo-600 hover:text-indigo-800" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button class="delete-question text-red-500 hover:text-red-700" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                ${optionsHtml}
            `;
            
            questionsContainer.appendChild(questionDiv);
        });
        
        // Add event listeners to the buttons
        document.querySelectorAll('.edit-question').forEach(btn => {
            btn.addEventListener('click', () => editQuestion(parseInt(btn.dataset.index)));
        });
        
        document.querySelectorAll('.duplicate-question').forEach(btn => {
            btn.addEventListener('click', () => duplicateQuestion(parseInt(btn.dataset.index)));
        });
        
        document.querySelectorAll('.delete-question').forEach(btn => {
            btn.addEventListener('click', () => deleteQuestion(parseInt(btn.dataset.index)));
        });
    }

    function getQuestionTypeLabel(type) {
        switch(type) {
            case 'text': return 'Text Question';
            case 'number': return 'Number Input';
            case 'single': return 'Single Select';
            case 'multi': return 'Multiple Choice';
            default: return type;
        }
    }

    function editQuestion(index) {
        editingQuestionIndex = index;
        const question = questions[index];
        
        document.getElementById('questionText').value = question.text;
        document.getElementById('questionType').value = question.type;
        document.getElementById('requiredQuestion').checked = question.required;
        
        // Update options if applicable
        if (question.type === 'single' || question.type === 'multi') {
            optionsContainer.classList.remove('hidden');
            
            const optionsList = document.getElementById('optionsList');
            optionsList.innerHTML = '';
            
            question.options.forEach((option, i) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option-item flex items-center';
                optionDiv.innerHTML = `
                    <input type="text" class="option-input w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value="${option}" placeholder="Option ${i+1}">
                    <button type="button" class="ml-2 text-red-500 hover:text-red-700 remove-option">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                `;
                
                optionsList.appendChild(optionDiv);
                
                // Add event listener to the remove button
                optionDiv.querySelector('.remove-option').addEventListener('click', function() {
                    optionsList.removeChild(optionDiv);
                    updateRemoveButtons();
                });
            });
            
            updateRemoveButtons();
        } else {
            optionsContainer.classList.add('hidden');
        }
        
        // Update button text to reflect we're editing
        saveQuestionBtn.textContent = 'Save Changes';
        
        // Show the modal
        addQuestionModal.classList.remove('hidden');
    }

    function duplicateQuestion(index) {
        const question = { ...questions[index] };
        question.id = Date.now(); // Generate new ID
        question.text = `${question.text} (Copy)`;
        questions.push(question);
        renderQuestions();
    }

    function deleteQuestion(index) {
        if (confirm('Are you sure you want to delete this question?')) {
            questions.splice(index, 1);
            renderQuestions();
        }
    }

    function saveSurvey() {
        if (questions.length === 0) {
            alert('Please add at least one question to your survey');
            return;
        }
        
        // In a real app, we would save this data to a database
        const survey = {
            id: surveyId,
            title: surveyTitle,
            description: surveyDescription,
            questions: questions,
            status: 'draft',
            createdAt: new Date().toISOString()
        };
        
        // For now, we'll just save to localStorage for demo purposes
        const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
        const existingIndex = surveys.findIndex(s => s.id === survey.id);
        
        if (existingIndex !== -1) {
            surveys[existingIndex] = survey;
        } else {
            surveys.push(survey);
        }
        
        localStorage.setItem('surveys', JSON.stringify(surveys));
        
        // Redirect to survey details page
        window.location.href = `survey-details.html?id=${survey.id}`;
    }

    // Load existing survey questions if editing
    const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    const currentSurvey = surveys.find(s => s.id === surveyId);
    if (currentSurvey && currentSurvey.questions) {
        questions = currentSurvey.questions;
    }

    // Initialize UI
    renderQuestions();
});
