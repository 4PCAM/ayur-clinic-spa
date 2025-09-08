import React from 'react';
import { 
  Flame, 
  Users, 
  Leaf, 
  Waves, 
  FileText, 
  Activity,
  Heart,
  Brain
} from 'lucide-react';
import { PillarCard } from './PillarCard';

interface ClinicalAssessmentDashboardProps {
  onNavigateToPillar?: (pillarId: string) => void;
  assessmentProgress?: {
    agni: number;
    dosha: number;
    dhatu: number;
    srota: number;
  };
}

export function ClinicalAssessmentDashboard({ onNavigateToPillar, assessmentProgress }: ClinicalAssessmentDashboardProps) {
  const pillars = [
    {
      id: 'agni',
      title: 'Pillar 1 - Agni Dusti',
      description: 'Assessment of digestive fire and metabolic function. Evaluate the body\'s ability to digest, absorb, and transform nutrients.',
      icon: Flame,
      pillarType: 'agni' as const,
      progress: assessmentProgress?.agni || 0
    },
    {
      id: 'dosha',
      title: 'Pillar 2 - Dosha Dusti', 
      description: 'Constitutional analysis of Vata, Pitta, and Kapha imbalances. Understand the fundamental energetic patterns.',
      icon: Users,
      pillarType: 'dosha' as const,
      progress: assessmentProgress?.dosha || 0
    },
    {
      id: 'dhatu',
      title: 'Pillar 3 - Dhatu Dusti',
      description: 'Assessment of seven bodily tissues: Rasa, Rakta, Mamsa, Meda, Asthi, Majja, and Shukra tissue health.',
      icon: Leaf,
      pillarType: 'dhatu' as const,
      progress: assessmentProgress?.dhatu || 0
    },
    {
      id: 'srota',
      title: 'Pillar 4 - Sroto Dusti',
      description: 'Evaluation of body channels and their flow patterns. Assess the micro and macro circulatory systems.',
      icon: Waves,
      pillarType: 'srota' as const,
      progress: assessmentProgress?.srota || 0
    }
  ];

  const totalProgress = pillars.reduce((acc, pillar) => acc + pillar.progress, 0) / 4;
  const completedPillars = pillars.filter(p => p.progress === 100).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overall Progress */}
      <div className="max-w-md mx-auto space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-semibold text-primary">{Math.round(totalProgress)}%</span>
        </div>
        <div className="bg-muted rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-700 ease-out"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {completedPillars} of 4 pillars completed
        </p>
      </div>

      {/* Assessment Pillars */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center mb-6">Assessment Pillars</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pillars.map((pillar) => (
            <PillarCard
              key={pillar.id}
              title={pillar.title}
              description={pillar.description}
              icon={pillar.icon}
              pillarType={pillar.pillarType}
              progress={pillar.progress}
              isCompleted={pillar.progress === 100}
              onClick={() => onNavigateToPillar?.(pillar.id)}
              className="animate-fade-in"
            />
          ))}
        </div>
      </div>

      {/* Final Assessment Card */}
      <div className="max-w-2xl mx-auto">
        <div 
          onClick={() => onNavigateToPillar?.('final-assessment')}
          className={cn(
            "group relative p-6 rounded-xl border-2 cursor-pointer transition-ayur",
            "bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20",
            "hover:shadow-ayur-strong hover:scale-[1.02] active:scale-[0.98]",
            completedPillars === 4 && "ring-2 ring-primary shadow-ayur-medium"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-ayur">
                Final Assessment Dashboard
              </h3>
              <p className="text-muted-foreground text-sm">
                {completedPillars === 4 
                  ? "Review comprehensive analysis and generate clinical report"
                  : `Complete all ${4 - completedPillars} remaining pillars to access final dashboard`
                }
              </p>
            </div>
            {completedPillars === 4 && (
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center animate-pulse-gentle">
                <FileText className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}