import React, { useState } from 'react';
import { AccordionSPA } from '@/components/ui/accordion-spa';
import { HomeSection } from '@/components/4pcam/HomeSection';
import { ClinicalAssessmentDashboard } from '@/components/4pcam/ClinicalAssessmentDashboard';
import { 
  Flame, 
  Users, 
  Leaf, 
  Waves, 
  FileText,
  User,
  Stethoscope,
  Eye,
  Heart,
  Activity,
  Zap
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

  const PlaceholderAssessment = ({ title, description }: { title: string; description: string }) => (
    <div className="space-y-4">
      <p className="text-muted-foreground">{description}</p>
      <div className="bg-muted/30 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          {title} section will be developed as per Ayurvedic assessment protocols.
        </p>
      </div>
    </div>
  );

  // Clinical Assessment (4-PCAM) sub-items
  const clinicalAssessmentItems = [
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

  // Main assessment sections
  const mainAccordionItems = [
    {
      id: 'clinical-assessment',
      title: 'Clinical Assessment (4-PCAM)',
      icon: <Stethoscope className="w-5 h-5" />,
      children: (
        <div className="space-y-4">
          <ClinicalAssessmentDashboard 
            onNavigateToPillar={handleNavigateToPillar}
            assessmentProgress={assessmentProgress}
          />
          <AccordionSPA 
            items={clinicalAssessmentItems}
            defaultOpen="patient-info"
            className="space-y-4"
          />
        </div>
      ),
      className: 'border-primary/20 bg-gradient-to-br from-primary/5 to-background'
    },
    {
      id: 'disease-assessment',
      title: 'Disease Assessment',
      icon: <Activity className="w-5 h-5" />,
      children: (
        <PlaceholderAssessment 
          title="Disease Assessment"
          description="Comprehensive evaluation of disease manifestations, symptoms analysis, and pathological assessment according to Ayurvedic principles."
        />
      ),
      className: 'border-orange-200 bg-gradient-to-br from-orange-50 to-background'
    },
    {
      id: 'ashtaviddha-pariksha',
      title: 'Ashtaviddha Pariksha',
      icon: <Eye className="w-5 h-5" />,
      children: (
        <PlaceholderAssessment 
          title="Ashtaviddha Pariksha"
          description="Eight-fold examination: Nadi (pulse), Mutra (urine), Mala (stool), Jihva (tongue), Shabda (voice), Sparsha (touch), Druk (eyes), Akriti (appearance)."
        />
      ),
      className: 'border-blue-200 bg-gradient-to-br from-blue-50 to-background'
    },
    {
      id: 'dashaviddha-pariksha',
      title: 'Dashaviddha Pariksha',
      icon: <Heart className="w-5 h-5" />,
      children: (
        <PlaceholderAssessment 
          title="Dashaviddha Pariksha"
          description="Ten-fold examination including additional parameters: Ahar (diet), Vihar (lifestyle), along with the eight-fold examination for comprehensive evaluation."
        />
      ),
      className: 'border-green-200 bg-gradient-to-br from-green-50 to-background'
    },
    {
      id: 'prakruti-pariksha',
      title: 'Prakruti Pariksha',
      icon: <Zap className="w-5 h-5" />,
      children: (
        <PlaceholderAssessment 
          title="Prakruti Pariksha"
          description="Constitutional analysis to determine individual's natural constitution (Prakruti) - the inherent proportion of Vata, Pitta, and Kapha doshas."
        />
      ),
      className: 'border-purple-200 bg-gradient-to-br from-purple-50 to-background'
    },
    {
      id: 'dhatu-sarata',
      title: 'Dhatu Sarata',
      icon: <Leaf className="w-5 h-5" />,
      children: (
        <PlaceholderAssessment 
          title="Dhatu Sarata"
          description="Assessment of tissue excellence and quality - evaluation of the strength, quality, and functional capacity of the seven bodily tissues (Sapta Dhatus)."
        />
      ),
      className: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-background'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Static Home/Dashboard Content */}
        <div className="mb-8">
          <HomeSection 
            onNavigateToPillar={handleNavigateToPillar}
            assessmentProgress={assessmentProgress}
          />
        </div>

        {/* Collapsible Assessment Sections */}
        <AccordionSPA 
          items={mainAccordionItems}
          defaultOpen="clinical-assessment"
          className="space-y-6"
        />
      </div>
    </div>
  );
};

export default Index;
