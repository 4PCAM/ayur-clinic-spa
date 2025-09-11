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
      {/* Description */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
          Four Pillar Clinical Assessment Model
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          A comprehensive Ayurvedic clinical assessment framework integrating traditional wisdom 
          with modern diagnostic approaches for holistic patient evaluation.
        </p>
      </div>

      {/* Overview Progress */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="bg-card p-6 rounded-xl border shadow-ayur-soft">
          <h3 className="text-lg font-semibold mb-3">Assessment Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <pillar.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm font-medium">{pillar.progress}%</div>
                <div className="text-xs text-muted-foreground">
                  {pillar.title.split(' - ')[1]}
                </div>
              </div>
            ))}
          </div>
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