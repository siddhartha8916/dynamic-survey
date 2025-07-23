// Survey Creator App - Survey Details JavaScript
console.log('Survey Details JavaScript loaded');

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const editSurveyBtn = document.getElementById('editSurveyBtn');
    const addQuestionFromDetailsBtn = document.getElementById('addQuestionFromDetailsBtn');
    const deployPwaBtn = document.getElementById('deployPwaBtn');
    const deployBrowserBtn = document.getElementById('deployBrowserBtn');
    const deployWhatsappBtn = document.getElementById('deployWhatsappBtn');
    const deploymentModal = document.getElementById('deploymentModal');
    const closeDeploymentModalBtn = document.getElementById('closeDeploymentModalBtn');
    const cancelDeploymentBtn = document.getElementById('cancelDeploymentBtn');
    const confirmDeploymentBtn = document.getElementById('confirmDeploymentBtn');
    const successModal = document.getElementById('successModal');
    const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
    const copyUrlBtn = document.getElementById('copyUrlBtn');

    // Get survey ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('id');

    // Current deployment type
    let currentDeploymentType = null;

    // Load survey data
    let survey = null;
    loadSurveyData();

    // Event listeners
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    editSurveyBtn.addEventListener('click', editSurvey);
    addQuestionFromDetailsBtn.addEventListener('click', addQuestion);
    
    deployPwaBtn.addEventListener('click', () => openDeploymentModal('pwa'));
    deployBrowserBtn.addEventListener('click', () => openDeploymentModal('browser'));
    deployWhatsappBtn.addEventListener('click', () => openDeploymentModal('whatsapp'));
    
    closeDeploymentModalBtn.addEventListener('click', closeDeploymentModal);
    cancelDeploymentBtn.addEventListener('click', closeDeploymentModal);
    confirmDeploymentBtn.addEventListener('click', deploySurvey);
    
    closeSuccessModalBtn.addEventListener('click', closeSuccessModal);
    copyUrlBtn.addEventListener('click', copyDeploymentUrl);

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
        
        // Update UI with survey data
        document.getElementById('surveyTitleHeader').textContent = survey.title;
        document.getElementById('surveyTitle').textContent = survey.title;
        document.getElementById('surveyDescription').textContent = survey.description || 'No description provided.';
        
        const createdDate = new Date(survey.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        document.getElementById('createdDate').textContent = `Created: ${createdDate}`;
        
        document.getElementById('questionCount').textContent = `${survey.questions.length} Questions`;
        document.getElementById('responseCount').textContent = `${survey.responses || 0} Responses`;
        
        // Set status
        const statusElement = document.getElementById('surveyStatus');
        statusElement.textContent = survey.status.charAt(0).toUpperCase() + survey.status.slice(1);
        
        switch(survey.status) {
            case 'active':
                statusElement.className = 'text-sm font-medium bg-green-100 text-green-800 rounded-full px-2 py-1';
                break;
            case 'draft':
                statusElement.className = 'text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full px-2 py-1';
                break;
            case 'closed':
                statusElement.className = 'text-sm font-medium bg-gray-100 text-gray-800 rounded-full px-2 py-1';
                break;
            default:
                statusElement.className = 'text-sm font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-1';
        }
        
        // Load questions
        renderQuestions();
        
        // Update deployment status
        updateDeploymentStatus();
        
        // Set document title
        document.title = `${survey.title} - Survey Details`;
    }

    function renderQuestions() {
        const questionsContainer = document.getElementById('questionsContainer');
        
        if (!survey || !survey.questions || survey.questions.length === 0) {
            questionsContainer.innerHTML = `
                <div class="text-center py-6">
                    <p class="text-gray-500">No questions added yet. Click "Add Question" to create your first question.</p>
                </div>
            `;
            return;
        }
        
        questionsContainer.innerHTML = '';
        
        survey.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'border rounded-lg p-4 bg-white';
            
            let optionsHtml = '';
            if (question.options && question.options.length > 0) {
                optionsHtml = '<div class="mt-2 text-sm text-gray-600">';
                
                if (question.type === 'single') {
                    question.options.forEach(option => {
                        optionsHtml += `
                            <div class="flex items-center mt-1">
                                <span class="w-4 h-4 border border-gray-400 rounded-full mr-2"></span>
                                <span>${option}</span>
                            </div>
                        `;
                    });
                } else if (question.type === 'multi') {
                    question.options.forEach(option => {
                        optionsHtml += `
                            <div class="flex items-center mt-1">
                                <span class="w-4 h-4 border border-gray-400 rounded mr-2"></span>
                                <span>${option}</span>
                            </div>
                        `;
                    });
                }
                
                optionsHtml += '</div>';
            }

            // Get question type label
            let typeLabel;
            switch(question.type) {
                case 'text': typeLabel = 'Text Question'; break;
                case 'number': typeLabel = 'Number Input'; break;
                case 'single': typeLabel = 'Single Select'; break;
                case 'multi': typeLabel = 'Multiple Choice'; break;
                default: typeLabel = question.type;
            }
            
            questionDiv.innerHTML = `
                <div class="flex justify-between">
                    <div>
                        <div class="flex items-center">
                            <h4 class="font-medium text-gray-800">${question.text}</h4>
                            ${question.required ? '<span class="ml-1 text-red-500">*</span>' : ''}
                        </div>
                        <p class="text-gray-500 text-xs mt-1">${typeLabel}</p>
                    </div>
                    <div>
                        <span class="text-gray-400 text-sm">#${index + 1}</span>
                    </div>
                </div>
                ${optionsHtml}
            `;
            
            questionsContainer.appendChild(questionDiv);
        });
    }

    function switchTab(tabId) {
        // Update tab buttons
        tabButtons.forEach(button => {
            if (button.dataset.tab === tabId) {
                button.classList.remove('text-medium', 'border-transparent', 'hover:text-dark', 'hover:border-secondary');
                button.classList.add('border-primary', 'text-primary');
            } else {
                button.classList.remove('border-primary', 'text-primary');
                button.classList.add('text-medium', 'border-transparent', 'hover:text-dark', 'hover:border-secondary');
            }
        });
        
        // Show selected tab content
        tabContents.forEach(content => {
            content.classList.toggle('hidden', content.id !== `${tabId}Tab`);
        });
    }

    function editSurvey() {
        // Redirect to edit survey page
        console.log(`Editing survey: ${surveyId}`);
        window.location.href = `create-questions.html?id=${surveyId}&title=${encodeURIComponent(survey.title)}&description=${encodeURIComponent(survey.description || '')}`;
    }

    function addQuestion() {
        // Redirect to questions page
        window.location.href = `create-questions.html?id=${surveyId}&title=${encodeURIComponent(survey.title)}&description=${encodeURIComponent(survey.description || '')}`;
    }

    function openDeploymentModal(type) {
        currentDeploymentType = type;
        
        // Set modal title
        const modalTitle = document.getElementById('deploymentModalTitle');
        switch(type) {
            case 'pwa':
                modalTitle.textContent = 'Deploy as Progressive Web App';
                break;
            case 'browser':
                modalTitle.textContent = 'Deploy as Browser-based Survey';
                break;
            case 'whatsapp':
                modalTitle.textContent = 'Deploy to WhatsApp Flows';
                break;
        }
        
        // Set form content based on deployment type
        const deploymentForm = document.getElementById('deploymentForm');
        
        switch(type) {
            case 'pwa':
                deploymentForm.innerHTML = `
                    <p class="text-medium mb-5">Your survey will be deployed as a Progressive Web App that can be installed on mobile devices and works offline.</p>
                    <div class="mb-5">
                        <label class="block text-sm font-medium text-medium mb-2">App Name</label>
                        <input type="text" id="pwaName" class="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter app name" value="${survey.title}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-medium mb-2">Theme Color</label>
                        <div class="flex">
                            <input type="color" id="themeColor" class="h-12 w-12 p-1 border border-secondary rounded-lg" value="#2B4652">
                            <div class="ml-2 flex-grow">
                                <select id="themePreset" class="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="#2B4652">Primary Blue</option>
                                    <option value="#10b981">Green</option>
                                    <option value="#ef4444">Red</option>
                                    <option value="#FFD649">Accent Yellow</option>
                                    <option value="#90A4AD">Secondary Gray</option>
                                </select>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'browser':
                deploymentForm.innerHTML = `
                    <p class="text-medium mb-5">Your survey will be deployed as a web page accessible from any browser with a shareable link.</p>
                    <div class="mb-5">
                        <label class="block text-sm font-medium text-medium mb-2">Survey URL Slug</label>
                        <div class="flex">
                            <span class="inline-flex items-center px-4 py-3 rounded-l-md border border-r-0 border-secondary bg-light text-medium text-sm">
                                surveyapp.com/
                            </span>
                            <input type="text" id="urlSlug" class="flex-1 min-w-0 block w-full px-4 py-3 rounded-r-lg border border-secondary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="my-survey" value="${survey.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}">
                        </div>
                    </div>
                    <div class="mb-5">
                        <label class="flex items-center">
                            <input type="checkbox" id="enableRecaptcha" class="mr-2 h-4 w-4 accent-primary">
                            <span class="text-sm text-medium">Enable reCAPTCHA to prevent spam responses</span>
                        </label>
                    </div>
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" id="collectEmailAddresses" class="mr-2 h-4 w-4 accent-primary">
                            <span class="text-sm text-medium">Collect respondent email addresses</span>
                        </label>
                    </div>
                `;
                break;
                
            case 'whatsapp':
                deploymentForm.innerHTML = `
                    <p class="text-medium mb-5">Your survey will be deployed as a WhatsApp Flow for easy sharing and responses via WhatsApp.</p>
                    <div class="mb-5">
                        <label class="block text-sm font-medium text-medium mb-2">WhatsApp Business Account</label>
                        <select id="whatsappAccount" class="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="demo">Demo Business Account</option>
                            <option value="connect">Connect a WhatsApp Business Account...</option>
                        </select>
                    </div>
                    <div class="mb-5">
                        <label class="block text-sm font-medium text-medium mb-2">Welcome Message</label>
                        <textarea id="welcomeMessage" rows="3" class="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter welcome message">${'Welcome to our survey: ' + survey.title}</textarea>
                    </div>
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" id="collectPhoneNumbers" class="mr-2 h-4 w-4 accent-primary">
                            <span class="text-sm text-medium">Store respondent phone numbers</span>
                        </label>
                    </div>
                `;
                break;
        }
        
        // Show modal
        deploymentModal.classList.remove('hidden');
    }

    function closeDeploymentModal() {
        deploymentModal.classList.add('hidden');
        currentDeploymentType = null;
    }

    function deploySurvey() {
        // In a real app, this would send data to the backend
        // For demo purposes, we'll simulate the deployment
        
        // Generate a demo URL based on deployment type
        let deploymentUrl;
        switch(currentDeploymentType) {
            case 'pwa':
                deploymentUrl = `https://surveyapp.com/pwa/${survey.id}-${encodeURIComponent(survey.title.toLowerCase().replace(/[^a-z0-9]/g, '-'))}`;
                break;
            case 'browser':
                const urlSlug = document.getElementById('urlSlug').value;
                deploymentUrl = `https://surveyapp.com/${urlSlug}`;
                break;
            case 'whatsapp':
                deploymentUrl = `https://wa.me/1234567890?text=Start%20Survey:%20${encodeURIComponent(survey.title)}`;
                break;
        }

        // Update survey with deployment info
        if (!survey.deployments) survey.deployments = {};
        survey.deployments[currentDeploymentType] = {
            url: deploymentUrl,
            deployedAt: new Date().toISOString(),
            status: 'active'
        };
        
        // Change survey status to active if it was a draft
        if (survey.status === 'draft') {
            survey.status = 'active';
        }
        
        // Save updated survey
        const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
        const surveyIndex = surveys.findIndex(s => s.id === surveyId);
        surveys[surveyIndex] = survey;
        localStorage.setItem('surveys', JSON.stringify(surveys));
        
        // Close deployment modal
        closeDeploymentModal();
        
        // Update deployment status on the page
        updateDeploymentStatus();
        
        // Show success modal
        showDeploymentSuccess(deploymentUrl);
    }

    function updateDeploymentStatus() {
        if (!survey.deployments) return;
        
        // Update PWA status
        if (survey.deployments.pwa) {
            const pwaStatus = document.getElementById('pwaDeploymentStatus');
            pwaStatus.innerHTML = `
                <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Deployed</span>
                <a href="${survey.deployments.pwa.url}" target="_blank" class="block text-indigo-600 text-xs mt-1 hover:underline">View App</a>
            `;
            deployPwaBtn.textContent = 'Update PWA';
        }
        
        // Update Browser status
        if (survey.deployments.browser) {
            const browserStatus = document.getElementById('browserDeploymentStatus');
            browserStatus.innerHTML = `
                <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Deployed</span>
                <a href="${survey.deployments.browser.url}" target="_blank" class="block text-indigo-600 text-xs mt-1 hover:underline">View Survey</a>
            `;
            deployBrowserBtn.textContent = 'Update Browser Version';
        }
        
        // Update WhatsApp status
        if (survey.deployments.whatsapp) {
            const whatsappStatus = document.getElementById('whatsappDeploymentStatus');
            whatsappStatus.innerHTML = `
                <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Deployed</span>
                <a href="${survey.deployments.whatsapp.url}" target="_blank" class="block text-indigo-600 text-xs mt-1 hover:underline">Open in WhatsApp</a>
            `;
            deployWhatsappBtn.textContent = 'Update WhatsApp Flow';
        }
    }

    function showDeploymentSuccess(url) {
        // Update success modal content
        const successModalTitle = document.getElementById('successModalTitle');
        let deploymentType;
        switch(currentDeploymentType) {
            case 'pwa': deploymentType = 'Progressive Web App'; break;
            case 'browser': deploymentType = 'Browser'; break;
            case 'whatsapp': deploymentType = 'WhatsApp Flow'; break;
        }
        successModalTitle.textContent = `Survey Deployed to ${deploymentType}!`;
        
        document.getElementById('successModalMessage').textContent = `Your survey has been successfully deployed as a ${deploymentType}.`;
        document.getElementById('deploymentUrl').value = url;
        
        // Show the modal
        successModal.classList.remove('hidden');
    }

    function closeSuccessModal() {
        successModal.classList.add('hidden');
    }

    function copyDeploymentUrl() {
        const urlInput = document.getElementById('deploymentUrl');
        urlInput.select();
        document.execCommand('copy');
        
        // Show copied feedback
        const originalText = copyUrlBtn.textContent;
        copyUrlBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyUrlBtn.textContent = originalText;
        }, 2000);
    }
});
