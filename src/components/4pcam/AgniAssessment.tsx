import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgniData {
  vishama: number;
  tikshna: number;
  manda: number;
  sama: number;
  selections: Record<string, string>;
  selectedSymptoms: Record<string, {
    type: string;
    symptom: string;
    parameter: string;
  }>;
  completed: boolean;
  timestamp: string | null;
}

interface AgniAssessmentProps {
  onComplete?: (data: AgniData) => void;
  onProgressUpdate?: (progress: number) => void;
}

export function AgniAssessment({ onComplete, onProgressUpdate }: AgniAssessmentProps) {
  const [agniData, setAgniData] = useState<AgniData>({
    vishama: 0,
    tikshna: 0,
    manda: 0,
    sama: 0,
    selections: {},
    selectedSymptoms: {},
    completed: false,
    timestamp: null
  });

  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | null>(null);

  // Assessment questions and their options
  const assessmentQuestions = [
    {
      key: 'hunger',
      question: 'How would you best describe your appetite?',
      options: [
        { value: 'vishama', text: 'Irregular and unpredictable, varies from day to day' },
        { value: 'tikshna', text: 'Frequent and excessive; you feel a burning sensation when hungry' },
        { value: 'manda', text: 'Poor and delayed; you often don\'t feel hungry' },
        { value: 'sama', text: 'Timely and appropriate; you get hungry at regular intervals' }
      ]
    },
    {
      key: 'digestion',
      question: 'How would you describe your digestion timing?',
      options: [
        { value: 'vishama', text: 'Alternates between fast and slow, unpredictable' },
        { value: 'tikshna', text: 'Very rapid; food processes quickly' },
        { value: 'manda', text: 'Very slow and sluggish, taking hours' },
        { value: 'sama', text: 'Comfortable and timely (3-4 hours)' }
      ]
    },
    {
      key: 'stool',
      question: 'How would you describe your bowel movements?',
      options: [
        { value: 'vishama', text: 'Constipation alternating with loose stools, irregular' },
        { value: 'tikshna', text: 'Loose, burning, frequent with urgency' },
        { value: 'manda', text: 'Constipated, sticky, heavy stools' },
        { value: 'sama', text: 'Well-formed, regular daily movements without discomfort' }
      ]
    },
    {
      key: 'bloating',
      question: 'How do you feel after eating?',
      options: [
        { value: 'vishama', text: 'Gas, bloating, cramping with erratic symptoms' },
        { value: 'tikshna', text: 'Burning sensation, acidity, heat in stomach' },
        { value: 'manda', text: 'Heavy, sluggish feeling, fullness for hours' },
        { value: 'sama', text: 'No significant discomfort, light feeling' }
      ]
    },
    {
      key: 'appetite',
      question: 'How does your appetite respond to different situations?',
      options: [
        { value: 'vishama', text: 'Varies with stress, weather, and emotions' },
        { value: 'tikshna', text: 'Quick return of hunger after eating, can\'t skip meals' },
        { value: 'manda', text: 'Long periods without hunger, eating by routine only' },
        { value: 'sama', text: 'Stable appetite, can skip meals without distress' }
      ]
    },
    {
      key: 'tongue',
      question: 'How would you describe your tongue appearance?',
      options: [
        { value: 'vishama', text: 'Dry, rough, cracked with variable coating' },
        { value: 'tikshna', text: 'Red, inflamed with yellow/greenish coating' },
        { value: 'manda', text: 'Thick white coating, swollen, pale' },
        { value: 'sama', text: 'Pink, clean with minimal clear coating' }
      ]
    },
    {
      key: 'afterfood',
      question: 'How do you typically feel after meals?',
      options: [
        { value: 'vishama', text: 'Sometimes energetic, sometimes tired' },
        { value: 'tikshna', text: 'Initially satisfied but quickly becomes hungry again' },
        { value: 'manda', text: 'Heavy, lethargic, sleepy for hours' },
        { value: 'sama', text: 'Light, content, energetic feeling' }
      ]
    },
    {
      key: 'weight',
      question: 'How does your weight typically behave?',
      options: [
        { value: 'vishama', text: 'Fluctuates frequently, difficulty maintaining' },
        { value: 'tikshna', text: 'Can lose weight easily, high metabolism' },
        { value: 'manda', text: 'Tendency to gain weight, difficult to lose' },
        { value: 'sama', text: 'Stable weight, easy to maintain ideal weight' }
      ]
    }
  ];

  const agniTypes = {
    vishama: { 
      label: 'Viṣama Agni (Vata Duṣṭi)', 
      description: 'Irregular/Variable patterns',
      color: 'bg-orange-50 border-orange-200 text-orange-900',
      risk: 'IBS-like symptoms, flatulence, irregular metabolism, anxiety disorders (Vata dominance)'
    },
    tikshna: { 
      label: 'Tīkṣṇa Agni (Pitta Duṣṭi)', 
      description: 'Excessive/Sharp patterns',
      color: 'bg-red-50 border-red-200 text-red-900',
      risk: 'Hyperacidity, peptic ulcers, gastritis, inflammatory conditions (Pitta dominance)'
    },
    manda: { 
      label: 'Manda Agni (Kapha Duṣṭi)', 
      description: 'Sluggish/Slow patterns',
      color: 'bg-green-50 border-green-200 text-green-900',
      risk: 'Ama formation, metabolic sluggishness, obesity, diabetes risk (Kapha dominance)'
    },
    sama: { 
      label: 'Sama Agni (Balanced)', 
      description: 'Optimal patterns',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      risk: 'Optimal digestion, proper tissue nourishment, robust immunity (Tridosha Balance)'
    }
  };

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('4pcam_agni_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setAgniData(parsedData);
      } catch (error) {
        console.error('Error loading agni data:', error);
      }
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (Object.keys(agniData.selections).length > 0) {
        saveAgniData();
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [agniData]);

  const saveAgniData = () => {
    setAutoSaveStatus('saving');
    const dataToSave = {
      ...agniData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('4pcam_agni_data', JSON.stringify(dataToSave));
    setAutoSaveStatus('saved');
    setTimeout(() => setAutoSaveStatus(null), 2000);
  };

  const handleQuestionAnswer = (questionKey: string, agniType: string) => {
    const newSelections = { ...agniData.selections };
    const newSymptoms = { ...agniData.selectedSymptoms };

    // Remove previous selection for this parameter
    const previousSelection = newSelections[questionKey];
    if (previousSelection) {
      setAgniData(prev => ({
        ...prev,
        [previousSelection as keyof AgniData]: Math.max(0, (prev[previousSelection as keyof AgniData] as number) - 1)
      }));
    }

    // Add new selection
    newSelections[questionKey] = agniType;
    const question = assessmentQuestions.find(q => q.key === questionKey);
    const selectedOption = question?.options.find(opt => opt.value === agniType);
    
    newSymptoms[questionKey] = {
      type: agniType,
      symptom: selectedOption?.text || '',
      parameter: questionKey
    };

    setAgniData(prev => ({
      ...prev,
      selections: newSelections,
      selectedSymptoms: newSymptoms,
      [agniType]: (prev[agniType as keyof AgniData] as number) + 1
    }));

    // Update progress
    const completedCount = Object.keys(newSelections).length;
    const progress = (completedCount / 8) * 100;
    onProgressUpdate?.(progress);
  };

  const calculateSeverity = () => {
    const totalDustiScore = agniData.vishama + agniData.tikshna + agniData.manda;
    
    if (totalDustiScore === 0 && agniData.sama > 0) {
      return {
        level: 'SAMA AGNI (Balanced)',
        description: 'Ideal digestion, proper dhatu nourishment, strong immunity',
        color: 'bg-green-500'
      };
    } else if (totalDustiScore >= 1 && totalDustiScore <= 4) {
      return {
        level: 'MILD AGNI DUSTI',
        description: 'Minor digestive imbalance, lifestyle modifications recommended',
        color: 'bg-yellow-500'
      };
    } else if (totalDustiScore >= 5 && totalDustiScore <= 6) {
      return {
        level: 'MODERATE AGNI DUSTI',
        description: 'Significant digestive dysfunction, targeted treatment required',
        color: 'bg-orange-500'
      };
    } else if (totalDustiScore >= 7) {
      return {
        level: 'SEVERE AGNI DUSTI',
        description: 'Major digestive pathology, immediate comprehensive intervention needed',
        color: 'bg-red-500'
      };
    }
    return { level: 'Assessment Incomplete', description: '', color: 'bg-gray-500' };
  };

  const getDominantPattern = () => {
    const scores = {
      vishama: agniData.vishama,
      tikshna: agniData.tikshna,
      manda: agniData.manda,
      sama: agniData.sama
    };
    
    const maxScore = Math.max(...Object.values(scores));
    const dominantType = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
    
    return dominantType ? {
      type: dominantType,
      score: maxScore,
      label: agniTypes[dominantType as keyof typeof agniTypes].label,
      risk: agniTypes[dominantType as keyof typeof agniTypes].risk
    } : null;
  };

  const handleCompleteAssessment = () => {
    const completedData = {
      ...agniData,
      completed: true,
      timestamp: new Date().toISOString()
    };
    setAgniData(completedData);
    localStorage.setItem('4pcam_agni_data', JSON.stringify(completedData));
    onComplete?.(completedData);
  };

  const isCompleted = Object.keys(agniData.selections).length === 8;
  const severity = calculateSeverity();
  const dominantPattern = getDominantPattern();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">🔥</span>
          <h3 className="text-2xl font-bold text-foreground">AGNI DUSTI ASSESSMENT</h3>
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          PILLAR 1 of 4-PCAM
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Digestive Fire Evaluation Based on Classical Ayurvedic Principles
        </p>
      </div>

      {/* Progress and Auto-save Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Progress: {Object.keys(agniData.selections).length}/8 parameters
          </span>
          {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
        </div>
        {autoSaveStatus && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {autoSaveStatus === 'saving' ? (
              <>
                <Clock className="w-3 h-3 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                Auto-saved
              </>
            )}
          </div>
        )}
      </div>


      {/* Assessment Questions */}
      <div className="space-y-6">
        {assessmentQuestions.map((question, index) => (
          <Card key={question.key}>
            <CardHeader>
              <CardTitle className="text-lg">
                {index + 1}. {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={agniData.selections[question.key] || ''}
                onValueChange={(value) => handleQuestionAnswer(question.key, value)}
                className="space-y-3"
              >
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3">
                    <RadioGroupItem value={option.value} id={`${question.key}-${option.value}`} className="mt-1" />
                    <Label 
                      htmlFor={`${question.key}-${option.value}`}
                      className="text-sm leading-relaxed cursor-pointer flex-1 hover:text-primary transition-colors"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {agniData.selections[question.key] && (
                <div className="mt-3 text-xs text-primary font-medium">
                  ✓ Answer selected
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results Section */}
      {Object.keys(agniData.selections).length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Selected Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Selected Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(agniData.selectedSymptoms).map(([param, symptom]) => {
                const question = assessmentQuestions.find(q => q.key === param);
                return (
                  <div key={param} className="border-l-4 border-primary pl-3">
                    <div className="font-semibold text-sm">
                      {question?.question || param}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {agniTypes[symptom.type as keyof typeof agniTypes].label}
                    </div>
                    <div className="text-xs mt-1">{symptom.symptom}</div>
                  </div>
                );
              })}
        </CardContent>
      </Card>

      {/* Score Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(agniTypes).map(([type, config]) => (
          <Card key={type} className={cn("text-center", config.color)}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {agniData[type as keyof AgniData] as number}/8
              </div>
              <div className="text-xs font-medium mt-1">
                {config.label.split(' ')[0]} Agni
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

          {/* Clinical Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Assessment Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div>Total Dusti Score: {agniData.vishama + agniData.tikshna + agniData.manda}/8</div>
                <div>Sama Agni Score: {agniData.sama}/8</div>
                <div>Parameters Assessed: {Object.keys(agniData.selections).length}/8</div>
                <div>Completion: {Math.round((Object.keys(agniData.selections).length / 8) * 100)}%</div>
              </div>
              
              {isCompleted && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Assessment:</span>
                    <Badge className={cn("text-white", severity.color)}>
                      {severity.level}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {severity.description}
                  </div>
                  
                  {dominantPattern && (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">
                        Dominant Pattern: {dominantPattern.label} (Score: {dominantPattern.score}/8)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Clinical Significance: {dominantPattern.risk}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Complete Assessment Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleCompleteAssessment}
          disabled={!isCompleted}
          className="px-8 py-2"
        >
          {isCompleted ? 'Complete Agni Assessment' : `Complete ${8 - Object.keys(agniData.selections).length} more parameters`}
        </Button>
      </div>
    </div>
  );
}