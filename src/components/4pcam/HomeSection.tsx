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

interface HomeSectionProps {
  onNavigateToPillar?: (pillarId: string) => void;
  assessmentProgress?: {
    agni: number;
    dosha: number;
    dhatu: number;
    srota: number;
  };
}

export function HomeSection({ onNavigateToPillar, assessmentProgress }: HomeSectionProps) {
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
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary">
            Vedic Health Scan
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Four Pillar Clinical Assessment Model
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A unified platform combining ancient Vedic wisdom with modern technology to provide 
            comprehensive health assessments and personalized wellness insights.
          </p>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="text-center space-y-3 p-4">
          <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-xl flex items-center justify-center text-white">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="font-semibold">Comprehensive Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Holistic evaluation across all physiological systems
          </p>
        </div>
        
        <div className="text-center space-y-3 p-4">
          <div className="w-12 h-12 mx-auto bg-gradient-healing rounded-xl flex items-center justify-center text-white">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-semibold">Traditional Wisdom</h3>
          <p className="text-sm text-muted-foreground">
            Rooted in authentic Ayurvedic principles and practices
          </p>
        </div>
        
        <div className="text-center space-y-3 p-4">
          <div className="w-12 h-12 mx-auto bg-gradient-wisdom rounded-xl flex items-center justify-center text-white">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="font-semibold">Clinical Precision</h3>
          <p className="text-sm text-muted-foreground">
            Structured assessment for accurate diagnosis
          </p>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}