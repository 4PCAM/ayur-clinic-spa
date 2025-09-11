import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Save, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [expandedParameter, setExpandedParameter] = useState<string | null>(null);

  // Assessment parameters and their symptoms
  const assessmentMatrix = {
    hunger: {
      label: 'Hunger Patterns',
      description: 'Regularity and intensity of appetite',
      symptoms: {
        vishama: 'Irregular, unpredictable appetite that varies day to day',
        tikshna: 'Frequent excessive hunger, burns like fire when hungry',
        manda: 'Poor, delayed or absent hunger sensation',
        sama: 'Timely, appropriate hunger at regular intervals'
      }
    },
    digestion: {
      label: 'Digestion Timing',
      description: 'Speed of food processing',
      symptoms: {
        vishama: 'Alternating fast and slow digestion, unpredictable',
        tikshna: 'Very rapid digestion, food processes quickly',
        manda: 'Very slow, sluggish digestion taking hours',
        sama: 'Comfortable, timely digestion (3-4 hours)'
      }
    },
    stool: {
      label: 'Stool Formation',
      description: 'Bowel movement characteristics',
      symptoms: {
        vishama: 'Constipation alternating with loose stools, irregular',
        tikshna: 'Loose, burning, frequent stools with urgency',
        manda: 'Constipated, sticky, mucoid, heavy stools',
        sama: 'Well-formed, regular daily stools without discomfort'
      }
    },
    bloating: {
      label: 'Bloating/Discomfort',
      description: 'Post-meal digestive symptoms',
      symptoms: {
        vishama: 'Gas, bloating, cramping, erratic abdominal symptoms',
        tikshna: 'Burning sensation, acidity, heat in stomach',
        manda: 'Heavy, sluggish feeling, fullness for hours',
        sama: 'No significant discomfort, light feeling after eating'
      }
    },
    appetite: {
      label: 'Appetite Response',
      description: 'Changes in hunger patterns',
      symptoms: {
        vishama: 'Appetite varies with stress, weather, emotions',
        tikshna: 'Quick return of hunger after eating, can\'t skip meals',
        manda: 'Long periods without hunger, eating by routine only',
        sama: 'Stable appetite, can skip meals without distress'
      }
    },
    tongue: {
      label: 'Tongue Coating',
      description: 'Physical examination findings',
      symptoms: {
        vishama: 'Dry, rough, cracked tongue with variable coating',
        tikshna: 'Red, inflamed tongue with yellow/greenish coating',
        manda: 'Thick white coating, swollen, pale tongue',
        sama: 'Pink, clean tongue with minimal clear coating'
      }
    },
    afterfood: {
      label: 'After Food Sensation',
      description: 'Post-prandial feelings',
      symptoms: {
        vishama: 'Sometimes energetic, sometimes tired after eating',
        tikshna: 'Initially satisfied but quickly becomes hungry again',
        manda: 'Heavy, lethargic, sleepy for hours after eating',
        sama: 'Light, content, energetic feeling after meals'
      }
    },
    weight: {
      label: 'Weight Changes',
      description: 'Metabolic indicators',
      symptoms: {
        vishama: 'Weight fluctuates frequently, difficulty maintaining',
        tikshna: 'Can lose weight easily, high metabolism',
        manda: 'Tendency to gain weight, difficult to lose weight',
        sama: 'Stable weight, easy to maintain ideal weight'
      }
    }
  };

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

  const handleCellClick = (parameter: string, agniType: string) => {
    const newSelections = { ...agniData.selections };
    const newSymptoms = { ...agniData.selectedSymptoms };

    // Remove previous selection for this parameter
    const previousSelection = newSelections[parameter];
    if (previousSelection) {
      setAgniData(prev => ({
        ...prev,
        [previousSelection as keyof AgniData]: Math.max(0, (prev[previousSelection as keyof AgniData] as number) - 1)
      }));
    }

    // Add new selection
    newSelections[parameter] = agniType;
    newSymptoms[parameter] = {
      type: agniType,
      symptom: assessmentMatrix[parameter as keyof typeof assessmentMatrix].symptoms[agniType as keyof typeof assessmentMatrix.hunger.symptoms],
      parameter
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


      {/* Assessment Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(assessmentMatrix).map(([paramKey, param]) => (
              <Card key={paramKey} className="border">
                <CardContent className="p-4">
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setExpandedParameter(expandedParameter === paramKey ? null : paramKey)}
                  >
                    {expandedParameter === paramKey ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <div>
                      <div className="text-sm font-semibold">{param.label}</div>
                      <div className="text-xs text-muted-foreground">{param.description}</div>
                    </div>
                  </div>
                  
                  {expandedParameter === paramKey ? (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(agniTypes).map(([agniType, agniConfig]) => (
                        <div 
                          key={agniType}
                          onClick={() => handleCellClick(paramKey, agniType)}
                          className={cn(
                            "p-3 rounded-lg text-sm cursor-pointer transition-all duration-200",
                            "border-2 hover:shadow-md hover:-translate-y-0.5",
                            agniData.selections[paramKey] === agniType
                              ? "border-primary bg-primary/10 font-semibold shadow-lg scale-105"
                              : "border-muted hover:border-primary/50",
                            agniConfig.color
                          )}
                        >
                          {param.symptoms[agniType as keyof typeof param.symptoms]}
                          {agniData.selections[paramKey] === agniType && (
                            <div className="mt-2 text-xs font-bold text-primary">✓ Selected</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 text-center text-muted-foreground text-sm">
                      Click to expand assessment options
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

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
              {Object.entries(agniData.selectedSymptoms).map(([param, symptom]) => (
                <div key={param} className="border-l-4 border-primary pl-3">
                  <div className="font-semibold text-sm">
                    {assessmentMatrix[param as keyof typeof assessmentMatrix].label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {agniTypes[symptom.type as keyof typeof agniTypes].label}
                  </div>
                  <div className="text-xs mt-1">{symptom.symptom}</div>
                </div>
              ))}
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
              {isCompleted && (
                <div className="space-y-3">
                  {dominantPattern && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">Type of Agni Duṣṭi:</span>
                      <Badge className={cn("text-white", agniTypes[dominantPattern.type as keyof typeof agniTypes].color.includes('orange') ? 'bg-orange-500' : agniTypes[dominantPattern.type as keyof typeof agniTypes].color.includes('red') ? 'bg-red-500' : agniTypes[dominantPattern.type as keyof typeof agniTypes].color.includes('green') ? 'bg-green-500' : 'bg-blue-500')}>
                        {dominantPattern.label}
                      </Badge>
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