import React, { useState } from 'react';
import { AccordionSPA } from '@/components/ui/accordion-spa';
import { HomeSection } from '@/components/4pcam/HomeSection';
import { 
  Home, 
  Flame, 
  Users, 
  Leaf, 
  Waves, 
  FileText,
  User,
  Calendar,
  ClipboardList
} from 'lucide-react';

const Index = () => {
  const [assessmentProgress, setAssessmentProgress] = useState({
    agni: 0,
    dosha: 0, 
    dhatu: 0,
    srota: 0
  });

  const handleNavigateToPillar = (pillarId: string) => {
    // This will be used to auto-open specific accordion sections
    console.log('Navigate to pillar:', pillarId);
  };

  // Placeholder sections for now - will be built in subsequent steps
  const PatientInfoSection = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold mb-4">Patient Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Patient Name *</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-lg bg-background"
            placeholder="Enter patient name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Age/Sex *</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-lg bg-background"
            placeholder="e.g., 35/M"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">OPD No./IPD No.</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-lg bg-background"
            placeholder="Enter ID number"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Assessment</label>
          <input 
            type="date" 
            className="w-full px-3 py-2 border rounded-lg bg-background"
          />
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-sm font-medium">Chief Complaints *</label>
          <textarea 
            className="w-full px-3 py-2 border rounded-lg bg-background"
            rows={3}
            placeholder="Enter chief complaints"
          />
        </div>
      </div>
    </div>
  );

  const PlaceholderPillar = ({ title, description }: { title: string; description: string }) => (
    <div className="space-y-4">
      <p className="text-muted-foreground">{description}</p>
      <div className="bg-muted/30 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          {title} assessment interface will be built in the next step.
        </p>
      </div>
    </div>
  );

  const accordionItems = [
    {
      id: 'home',
      title: 'Home / Dashboard',
      icon: <Home className="w-5 h-5" />,
      children: (
        <HomeSection 
          onNavigateToPillar={handleNavigateToPillar}
          assessmentProgress={assessmentProgress}
        />
      ),
      className: 'border-primary/20 bg-gradient-to-br from-primary/5 to-background'
    },
    {
      id: 'patient-info',
      title: 'Patient Information',
      icon: <User className="w-5 h-5" />,
      children: <PatientInfoSection />,
      className: 'border-muted'
    },
    {
      id: 'agni',
      title: 'Pillar 1 - Agni Dusti',
      icon: <Flame className="w-5 h-5" />,
      children: (
        <PlaceholderPillar 
          title="Agni Assessment"
          description="Assessment of digestive fire and metabolic function. This section will evaluate the body's ability to digest, absorb, and transform nutrients."
        />
      ),
      className: 'pillar-agni'
    },
    {
      id: 'dosha', 
      title: 'Pillar 2 - Dosha Dusti',
      icon: <Users className="w-5 h-5" />,
      children: (
        <PlaceholderPillar 
          title="Dosha Assessment"
          description="Constitutional analysis of Vata, Pitta, and Kapha imbalances. This section will help understand the fundamental energetic patterns."
        />
      ),
      className: 'pillar-dosha'
    },
    {
      id: 'dhatu',
      title: 'Pillar 3 - Dhatu Dusti', 
      icon: <Leaf className="w-5 h-5" />,
      children: (
        <PlaceholderPillar 
          title="Dhatu Assessment"
          description="Assessment of seven bodily tissues: Rasa, Rakta, Mamsa, Meda, Asthi, Majja, and Shukra tissue health."
        />
      ),
      className: 'pillar-dhatu'
    },
    {
      id: 'srota',
      title: 'Pillar 4 - Sroto Dusti',
      icon: <Waves className="w-5 h-5" />,
      children: (
        <PlaceholderPillar 
          title="Srota Assessment"
          description="Evaluation of body channels and their flow patterns. This section will assess the micro and macro circulatory systems."
        />
      ),
      className: 'pillar-srota'
    },
    {
      id: 'final-assessment',
      title: 'Final Assessment Dashboard',
      icon: <FileText className="w-5 h-5" />,
      children: (
        <PlaceholderPillar 
          title="Final Assessment"
          description="Comprehensive dashboard with visual analytics, clinical insights, and export functionality for the complete 4-PCAM assessment."
        />
      ),
      className: 'border-accent/20 bg-gradient-to-br from-accent/5 to-background'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <AccordionSPA 
          items={accordionItems}
          defaultOpen="home"
          className="space-y-6"
        />
      </div>
    </div>
  );
};

export default Index;
