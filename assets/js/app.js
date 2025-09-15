// Main Application Logic for 4-PCAM

class FourPCAMApp {
  constructor() {
    this.assessmentProgress = {
      agni: 0,
      dosha: 0,
      dhatu: 0,
      srota: 0
    };
    
    this.patientData = {};
    
    this.init();
  }

  init() {
    this.loadSavedData();
    this.initializeEventListeners();
    this.updateProgressDisplay();
    
    // Initialize components
    this.accordion = new AccordionSPA();
    this.agniAssessment = new AgniAssessment();
    this.toast = new Toast();
    
    console.log('4-PCAM Application initialized');
  }

  loadSavedData() {
    // Load assessment progress
    const savedProgress = StorageManager.getItem('assessmentProgress');
    if (savedProgress) {
      this.assessmentProgress = { ...this.assessmentProgress, ...savedProgress };
    }

    // Load patient data
    const savedPatientData = StorageManager.getItem('patientData');
    if (savedPatientData) {
      this.patientData = savedPatientData;
      this.populatePatientForm();
    }
  }

  initializeEventListeners() {
    // Patient form listeners
    this.initPatientFormListeners();
    
    // Pillar card listeners
    this.initPillarListeners();
    
    // Auto-save functionality
    this.initAutoSave();
  }

  initPatientFormListeners() {
    const formInputs = document.querySelectorAll('#patient-info-section input, #patient-info-section select');
    
    formInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.updatePatientData(e.target.name, e.target.value);
      });
      
      input.addEventListener('input', (e) => {
        // Debounced auto-save for text inputs
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
          this.updatePatientData(e.target.name, e.target.value);
        }, 500);
      });
    });
  }

  initPillarListeners() {
    const pillarCards = document.querySelectorAll('.pillar-card');
    
    pillarCards.forEach(card => {
      card.addEventListener('click', () => {
        const pillarType = card.dataset.pillar;
        this.navigateToPillar(pillarType);
      });
    });
  }

  initAutoSave() {
    // Save progress every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      this.saveAllData();
    }, 30000);
  }

  updatePatientData(field, value) {
    this.patientData[field] = value;
    this.savePatientData();
  }

  populatePatientForm() {
    Object.keys(this.patientData).forEach(field => {
      const input = document.querySelector(`[name="${field}"]`);
      if (input) {
        input.value = this.patientData[field];
      }
    });
  }

  navigateToPillar(pillarType) {
    switch (pillarType) {
      case 'agni':
        this.openAgniAssessment();
        break;
      case 'dosha':
        this.toast.show('Coming Soon', 'Dosha assessment will be available in the next update.', 'info');
        break;
      case 'dhatu':
        this.toast.show('Coming Soon', 'Dhatu assessment will be available in the next update.', 'info');
        break;
      case 'srota':
        this.toast.show('Coming Soon', 'Srota assessment will be available in the next update.', 'info');
        break;
      default:
        console.log(`Navigation to ${pillarType} not implemented yet`);
    }
  }

  openAgniAssessment() {
    const modal = document.getElementById('agni-assessment-modal');
    const content = document.getElementById('agni-assessment-content');
    
    // Generate Agni assessment content
    content.innerHTML = this.agniAssessment.generateHTML();
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Initialize Agni assessment
    this.agniAssessment.init({
      onComplete: (data) => this.handleAgniComplete(data),
      onProgressUpdate: (progress) => this.handleAgniProgress(progress)
    });
  }

  handleAgniComplete(data) {
    this.assessmentProgress.agni = 100;
    this.updateProgressDisplay();
    this.saveAssessmentProgress();
    
    // Store Agni assessment data
    StorageManager.setItem('agniAssessmentData', data);
    
    this.toast.show('Assessment Complete', 'Agni assessment has been completed successfully!', 'success');
    
    // Close modal
    document.getElementById('agni-assessment-modal').classList.add('hidden');
  }

  handleAgniProgress(progress) {
    this.assessmentProgress.agni = progress;
    this.updateProgressDisplay();
    this.saveAssessmentProgress();
  }

  updateProgressDisplay() {
    // Update pillar cards with progress
    Object.keys(this.assessmentProgress).forEach(pillar => {
      const card = document.querySelector(`.pillar-card[data-pillar="${pillar}"]`);
      if (card) {
        this.updatePillarCard(card, pillar, this.assessmentProgress[pillar]);
      }
    });
  }

  updatePillarCard(card, pillarType, progress) {
    const progressRing = card.querySelector('.pillar-progress');
    const progressBar = card.querySelector('.pillar-progress-bar');
    const progressFill = card.querySelector('.progress-fill');
    const progressText = card.querySelector('.progress-text');
    const progressCircle = card.querySelector('.progress-bar');

    if (progress > 0) {
      // Show progress elements
      if (progressRing) progressRing.classList.remove('hidden');
      if (progressBar) progressBar.classList.remove('hidden');

      // Update circular progress
      if (progressCircle) {
        const circumference = 2 * Math.PI * 14; // r=14
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = offset;
      }

      // Update linear progress
      if (progressFill) {
        progressFill.style.setProperty('--progress-width', `${progress}%`);
      }

      // Update progress text
      if (progressText) {
        progressText.textContent = `${progress}%`;
      }

      // Add completed styling if 100%
      if (progress === 100) {
        card.classList.add('completed');
      }
    }
  }

  savePatientData() {
    StorageManager.setItem('patientData', this.patientData);
  }

  saveAssessmentProgress() {
    StorageManager.setItem('assessmentProgress', this.assessmentProgress);
  }

  saveAllData() {
    this.savePatientData();
    this.saveAssessmentProgress();
    console.log('Auto-save completed');
  }

  // Export functionality
  exportData() {
    const exportData = {
      timestamp: new Date().toISOString(),
      patientData: this.patientData,
      assessmentProgress: this.assessmentProgress,
      agniAssessmentData: StorageManager.getItem('agniAssessmentData')
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `4pcam-assessment-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.toast.show('Export Complete', 'Assessment data has been exported successfully!', 'success');
  }

  // Import functionality
  importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.patientData) {
          this.patientData = data.patientData;
          this.populatePatientForm();
          this.savePatientData();
        }
        
        if (data.assessmentProgress) {
          this.assessmentProgress = data.assessmentProgress;
          this.updateProgressDisplay();
          this.saveAssessmentProgress();
        }
        
        if (data.agniAssessmentData) {
          StorageManager.setItem('agniAssessmentData', data.agniAssessmentData);
        }

        this.toast.show('Import Complete', 'Assessment data has been imported successfully!', 'success');
      } catch (error) {
        this.toast.show('Import Error', 'Failed to import data. Please check the file format.', 'error');
      }
    };
    reader.readAsText(file);
  }

  // Cleanup
  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.fourPCAMApp = new FourPCAMApp();
  
  // Close modal listeners
  const closeModal = document.getElementById('close-agni-modal');
  const modal = document.getElementById('agni-assessment-modal');
  const overlay = modal?.querySelector('.modal-overlay');

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        modal.classList.add('hidden');
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal:not(.hidden)');
      if (openModal) {
        openModal.classList.add('hidden');
      }
    }
  });
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.fourPCAMApp) {
    window.fourPCAMApp.saveAllData();
    window.fourPCAMApp.destroy();
  }
});