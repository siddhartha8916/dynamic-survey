// Modal helper functions for the survey app

// Show modal
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Ensure content div is properly centered
    const modalContent = modal.querySelector(':scope > div');
    if (modalContent) {
      modalContent.classList.remove('hidden');
      modalContent.classList.add('flex');
    }
  }
}

// Hide modal
function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    // Hide the content div as well
    const modalContent = modal.querySelector(':scope > div');
    if (modalContent) {
      modalContent.classList.add('hidden');
      modalContent.classList.remove('flex');
    }
  }
}

// Initialize modals
function initModals() {
  // Get all modals
  const modals = document.querySelectorAll('[id$="Modal"]');
  
  // For each modal, add click event listener to close when clicking outside
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal(modal.id);
      }
    });
    
    // Find close buttons within the modal
    const closeButtons = modal.querySelectorAll('[id$="CloseBtn"], [id$="CancelBtn"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        hideModal(modal.id);
      });
    });
  });
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', initModals);
