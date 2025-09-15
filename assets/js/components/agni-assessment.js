// Agni Assessment Component for 4-PCAM

class AgniAssessment {
  constructor() {
    this.agniData = {
      vishama: 0,
      tikshna: 0,
      manda: 0,
      sama: 0,
      selectedSymptoms: {},
      completed: false
    };
    
    this.callbacks = {
      onComplete: null,
      onProgressUpdate: null
    };

    this.assessmentMatrix = {
      hunger: {
        label: "Hunger Patterns",
        description: "Assessment of appetite and hunger patterns",
        symptoms: {
          vishama: {
            label: "Irregular/Variable",
            description: "Appetite varies greatly - sometimes very hungry, sometimes no appetite at all. Unpredictable hunger patterns.",
            score: 2
          },
          tikshna: {
            label: "Excessive/Intense",
            description: "Always very hungry, strong appetite, gets angry or irritable when hungry. Cannot skip meals.",
            score: 2
          },
          manda: {
            label: "Poor/Weak",
            description: "Little to no appetite, rarely feels hungry, has to force themselves to eat.",
            score: 2
          },
          sama: {
            label: "Balanced/Regular",
            description: "Healthy appetite at regular meal times, feels satisfied after eating, no extreme hunger or lack of appetite.",
            score: 0
          }
        }
      },
      digestion: {
        label: "Digestion Process",
        description: "How food is digested and processed",
        symptoms: {
          vishama: {
            label: "Irregular/Unpredictable",
            description: "Digestion varies - sometimes quick, sometimes slow. Alternating constipation and loose stools.",
            score: 2
          },
          tikshna: {
            label: "Too Fast/Intense",
            description: "Food digests very quickly, frequent hunger soon after eating, tendency towards loose stools or diarrhea.",
            score: 2
          },
          manda: {
            label: "Slow/Sluggish",
            description: "Food sits heavy in stomach for long time, slow digestion, tendency towards constipation.",
            score: 2
          },
          sama: {
            label: "Optimal/Balanced",
            description: "Food digests at appropriate pace, comfortable feeling after meals, regular elimination.",
            score: 0
          }
        }
      },
      stool: {
        label: "Elimination Patterns",
        description: "Bowel movement characteristics and patterns",
        symptoms: {
          vishama: {
            label: "Irregular/Variable",
            description: "Inconsistent - sometimes constipated, sometimes loose. Unpredictable timing and consistency.",
            score: 2
          },
          tikshna: {
            label: "Frequent/Loose",
            description: "Multiple bowel movements per day, tendency towards loose stools or diarrhea, urgency.",
            score: 2
          },
          manda: {
            label: "Infrequent/Hard",
            description: "Constipation, hard or dry stools, difficulty passing, less than once daily.",
            score: 2
          },
          sama: {
            label: "Regular/Normal",
            description: "Once or twice daily, well-formed stools, easy passage, consistent timing.",
            score: 0
          }
        }
      },
      energy: {
        label: "Energy After Eating",
        description: "How you feel after meals in terms of energy",
        symptoms: {
          vishama: {
            label: "Unpredictable/Variable",
            description: "Sometimes energized, sometimes very tired after eating. Energy levels fluctuate unpredictably.",
            score: 2
          },
          tikshna: {
            label: "Initial Boost then Crash",
            description: "Feel energized immediately after eating but then experience energy crash or need to eat again soon.",
            score: 2
          },
          manda: {
            label: "Heavy/Lethargic",
            description: "Feel tired, heavy, or sluggish after eating. Want to sleep or rest after meals.",
            score: 2
          },
          sama: {
            label: "Sustained Energy",
            description: "Feel satisfied and have steady energy for 3-4 hours after eating. No extreme tiredness or hyperactivity.",
            score: 0
          }
        }
      },
      thirst: {
        label: "Thirst Patterns",
        description: "Water consumption and thirst patterns",
        symptoms: {
          vishama: {
            label: "Irregular/Forgetful",
            description: "Sometimes very thirsty, sometimes forget to drink. Irregular patterns of water consumption.",
            score: 1
          },
          tikshna: {
            label: "Excessive/Frequent",
            description: "Always thirsty, drinks large quantities of water, prefers cold drinks.",
            score: 1
          },
          manda: {
            label: "Little/Infrequent",
            description: "Rarely feels thirsty, drinks small amounts, prefers warm drinks.",
            score: 1
          },
          sama: {
            label: "Balanced/Appropriate",
            description: "Natural thirst, drinks appropriate amounts of water throughout the day.",
            score: 0
          }
        }
      },
      cravings: {
        label: "Food Cravings",
        description: "Types of foods you crave or prefer",
        symptoms: {
          vishama: {
            label: "Changeable/Inconsistent",
            description: "Cravings change frequently, sometimes want sweet, sometimes salty, sometimes no cravings at all.",
            score: 1
          },
          tikshna: {
            label: "Spicy/Cold/Sweet",
            description: "Crave spicy foods, cold drinks, ice cream, sweets. Want cooling and sweet foods.",
            score: 1
          },
          manda: {
            label: "Heavy/Sweet/Fatty",
            description: "Crave heavy, oily, sweet, or rich foods. Want comfort foods and dairy products.",
            score: 1
          },
          sama: {
            label: "Balanced/Moderate",
            description: "Enjoy variety of foods, no extreme cravings, satisfied with balanced meals.",
            score: 0
          }
        }
      }
    };

    this.agniTypes = {
      vishama: {
        label: "Vishama Agni (Irregular Fire)",
        description: "Variable and unpredictable digestive fire",
        color: "hsl(45, 70%, 60%)",
        risk: "Moderate to High"
      },
      tikshna: {
        label: "Tikshna Agni (Sharp Fire)", 
        description: "Excessive and intense digestive fire",
        color: "hsl(0, 70%, 60%)",
        risk: "Moderate"
      },
      manda: {
        label: "Manda Agni (Weak Fire)",
        description: "Slow and sluggish digestive fire",
        color: "hsl(200, 50%, 60%)",
        risk: "High"
      },
      sama: {
        label: "Sama Agni (Balanced Fire)",
        description: "Optimal and balanced digestive fire",
        color: "hsl(110, 50%, 50%)",
        risk: "Low"
      }
    };
  }

  init(callbacks = {}) {
    this.callbacks = { ...this.callbacks, ...callbacks };
    this.loadSavedData();
    this.attachEventListeners();
    this.updateDisplay();
  }

  generateHTML() {
    return `
      <div class="agni-assessment">
        <div class="assessment-header">
          <h3>Agni Assessment Matrix</h3>
          <p>Select the option that best describes your current digestive patterns:</p>
          <div class="assessment-progress">
            <div class="progress-bar">
              <div class="progress-fill" id="agni-progress-fill"></div>
            </div>
            <span class="progress-text" id="agni-progress-text">0%</span>
          </div>
        </div>

        <div class="assessment-matrix" id="agni-matrix">
          ${this.generateMatrixHTML()}
        </div>

        <div class="assessment-results" id="agni-results">
          ${this.generateResultsHTML()}
        </div>

        <div class="assessment-actions">
          <button id="complete-agni-btn" class="btn btn-primary" disabled>
            Complete Agni Assessment
          </button>
        </div>
      </div>
    `;
  }

  generateMatrixHTML() {
    return Object.entries(this.assessmentMatrix).map(([paramKey, param]) => `
      <div class="parameter-card" data-parameter="${paramKey}">
        <div class="parameter-header">
          <h4 class="parameter-title">${param.label}</h4>
          <p class="parameter-description">${param.description}</p>
        </div>
        <div class="symptoms-grid">
          ${Object.entries(param.symptoms).map(([agniType, symptom]) => `
            <div class="symptom-option ${agniType}" 
                 data-parameter="${paramKey}" 
                 data-agni-type="${agniType}"
                 data-score="${symptom.score}">
              <div class="symptom-header">
                <h5 class="symptom-label">${symptom.label}</h5>
                <span class="agni-type-badge ${agniType}">${this.agniTypes[agniType].label}</span>
              </div>
              <p class="symptom-description">${symptom.description}</p>
              <div class="symptom-selector">
                <input type="radio" 
                       name="param_${paramKey}" 
                       value="${agniType}" 
                       id="${paramKey}_${agniType}">
                <label for="${paramKey}_${agniType}">Select this option</label>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  generateResultsHTML() {
    const totalParameters = Object.keys(this.assessmentMatrix).length;
    const completedCount = Object.keys(this.agniData.selectedSymptoms).length;
    
    if (completedCount === 0) {
      return '<div class="results-placeholder">Complete the assessment to see your Agni analysis</div>';
    }

    return `
      <div class="results-section">
        <h4>Current Assessment Results</h4>
        
        <div class="agni-scores">
          ${Object.entries(this.agniTypes).map(([type, info]) => `
            <div class="score-item ${type}">
              <div class="score-label">${info.label}</div>
              <div class="score-value">${this.agniData[type]}</div>
              <div class="score-bar">
                <div class="score-fill" style="width: ${(this.agniData[type] / 12) * 100}%"></div>
              </div>
            </div>
          `).join('')}
        </div>

        ${completedCount === totalParameters ? this.generateFinalResultsHTML() : ''}
      </div>
    `;
  }

  generateFinalResultsHTML() {
    const dominant = this.getDominantPattern();
    const severity = this.calculateSeverity();

    return `
      <div class="final-results">
        <div class="dominant-pattern">
          <h5>Dominant Agni Pattern</h5>
          <div class="pattern-card ${dominant.type}">
            <h6>${dominant.label}</h6>
            <p>${this.agniTypes[dominant.type].description}</p>
            <div class="risk-level">Risk Level: <strong>${this.agniTypes[dominant.type].risk}</strong></div>
          </div>
        </div>

        <div class="severity-analysis">
          <h5>Overall Severity</h5>
          <div class="severity-card">
            <div class="severity-level ${severity.level}">${severity.level.toUpperCase()}</div>
            <p>${severity.description}</p>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    document.addEventListener('change', (e) => {
      if (e.target.matches('input[type="radio"][name^="param_"]')) {
        this.handleSelection(e.target);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.id === 'complete-agni-btn') {
        this.completeAssessment();
      }
    });
  }

  handleSelection(radioInput) {
    const parameter = radioInput.name.replace('param_', '');
    const agniType = radioInput.value;
    const score = parseInt(radioInput.closest('.symptom-option').dataset.score);
    
    // Reset scores for this parameter
    Object.keys(this.agniTypes).forEach(type => {
      if (this.agniData.selectedSymptoms[parameter]?.agniType === type) {
        this.agniData[type] -= this.agniData.selectedSymptoms[parameter].score;
      }
    });

    // Add new scores
    this.agniData[agniType] += score;
    this.agniData.selectedSymptoms[parameter] = {
      agniType,
      score,
      symptom: this.assessmentMatrix[parameter].symptoms[agniType]
    };

    this.saveData();
    this.updateDisplay();
    this.checkCompletion();
    
    if (this.callbacks.onProgressUpdate) {
      this.callbacks.onProgressUpdate(this.calculateProgress());
    }
  }

  updateDisplay() {
    // Update progress
    const progress = this.calculateProgress();
    const progressFill = document.getElementById('agni-progress-fill');
    const progressText = document.getElementById('agni-progress-text');
    
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;

    // Update results
    const resultsContainer = document.getElementById('agni-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = this.generateResultsHTML();
    }

    // Update selected options
    Object.entries(this.agniData.selectedSymptoms).forEach(([parameter, selection]) => {
      const radio = document.getElementById(`${parameter}_${selection.agniType}`);
      if (radio) {
        radio.checked = true;
      }
    });
  }

  calculateProgress() {
    const totalParameters = Object.keys(this.assessmentMatrix).length;
    const completedCount = Object.keys(this.agniData.selectedSymptoms).length;
    return Math.round((completedCount / totalParameters) * 100);
  }

  getDominantPattern() {
    let maxScore = -1;
    let dominantType = 'sama';
    
    Object.entries(this.agniData).forEach(([type, score]) => {
      if (type !== 'selectedSymptoms' && type !== 'completed' && typeof score === 'number') {
        if (score > maxScore) {
          maxScore = score;
          dominantType = type;
        }
      }
    });

    return {
      type: dominantType,
      label: this.agniTypes[dominantType].label,
      score: maxScore
    };
  }

  calculateSeverity() {
    const totalImbalanceScore = this.agniData.vishama + this.agniData.tikshna + this.agniData.manda;
    
    if (totalImbalanceScore === 0) {
      return {
        level: 'optimal',
        description: 'Your digestive fire appears to be well-balanced with no significant imbalances detected.'
      };
    } else if (totalImbalanceScore <= 3) {
      return {
        level: 'mild',
        description: 'Mild digestive imbalances detected. These can typically be addressed with dietary and lifestyle modifications.'
      };
    } else if (totalImbalanceScore <= 6) {
      return {
        level: 'moderate', 
        description: 'Moderate digestive imbalances present. Consider consulting with an Ayurvedic practitioner for personalized recommendations.'
      };
    } else {
      return {
        level: 'severe',
        description: 'Significant digestive imbalances detected. Professional Ayurvedic consultation is recommended for comprehensive treatment.'
      };
    }
  }

  checkCompletion() {
    const totalParameters = Object.keys(this.assessmentMatrix).length;
    const completedCount = Object.keys(this.agniData.selectedSymptoms).length;
    const completeBtn = document.getElementById('complete-agni-btn');
    
    if (completeBtn) {
      completeBtn.disabled = completedCount < totalParameters;
    }
  }

  completeAssessment() {
    this.agniData.completed = true;
    this.saveData();
    
    if (this.callbacks.onComplete) {
      this.callbacks.onComplete({
        ...this.agniData,
        dominant: this.getDominantPattern(),
        severity: this.calculateSeverity(),
        completedAt: new Date().toISOString()
      });
    }
  }

  saveData() {
    StorageManager.setItem('agniAssessmentData', this.agniData);
  }

  loadSavedData() {
    const savedData = StorageManager.getItem('agniAssessmentData');
    if (savedData) {
      this.agniData = { ...this.agniData, ...savedData };
    }
  }

  // Public API for resetting assessment
  reset() {
    this.agniData = {
      vishama: 0,
      tikshna: 0,
      manda: 0,
      sama: 0,
      selectedSymptoms: {},
      completed: false
    };
    this.saveData();
    this.updateDisplay();
  }

  // Export assessment data
  exportData() {
    return {
      ...this.agniData,
      dominant: this.getDominantPattern(),
      severity: this.calculateSeverity(),
      exportedAt: new Date().toISOString()
    };
  }
}