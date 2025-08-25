import { Badge } from '@/components/ui/badge';

interface SurveyHeaderProps {
  role: string;
}

const roleLabels: Record<string, string> = {
  pt_owner: 'Physical Therapy Practice Owner',
  pt_ceo_coo: 'PT CEO/COO',
  pt_consultant: 'Physical Therapy Consultant',
  healthcare_recruiter: 'Healthcare Recruiter',
  talent_leadership: 'Talent Leadership',
  physical_therapist: 'Physical Therapist'
};

export const SurveyHeader = ({ role }: SurveyHeaderProps) => {
  return (
    <div className="text-center space-y-6">
      {/* Platform Preview Image */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <img 
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&q=80&w=2000"
          alt="PT Ecosystem Platform Preview"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <div className="space-y-4">
        <Badge variant="secondary" className="mb-4">
          {roleLabels[role] || 'Healthcare Professional'}
        </Badge>
        
        <h1 className="text-4xl font-bold text-foreground">
          Help Shape the Future of PT Healthcare
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We're building a comprehensive platform to connect physical therapy professionals, 
          companies, and resources. Your insights will help us create the tools you actually need.
        </p>
        
        <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>7 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>Anonymous</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>Free beta access</span>
          </div>
        </div>
      </div>
    </div>
  );
};