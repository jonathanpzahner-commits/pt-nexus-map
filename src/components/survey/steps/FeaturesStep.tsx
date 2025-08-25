import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface FeaturesStepProps {
  role: string;
  data: any;
  onChange: (updates: any) => void;
}

export const FeaturesStep = ({ role, data, onChange }: FeaturesStepProps) => {
  const getFeatures = () => {
    const roleFeatures: Record<string, string[]> = {
      pt_owner: [
        'Searchable database of PT equipment vendors with pricing',
        'Vendor comparison tools with peer reviews and ratings',
        'Network of other practice owners for advice and referrals',
        'Market intelligence on competitor pricing and services',
        'Qualified PT candidate database with verified credentials',
        'Continuing education provider directory with staff reviews',
        'Practice management benchmarking against similar practices',
        'Supplier contract management and renewal reminders',
        'Local market salary and benefit benchmarking tools',
        'Physician referral relationship tracking system'
      ],
      pt_ceo_coo: [
        'Multi-location performance analytics and benchmarking',
        'Industry M&A and market intelligence dashboard',
        'Network of C-level executives for strategic insights',
        'Standardized vendor management across all locations',
        'Leadership talent pipeline and succession planning tools',
        'Market expansion and acquisition opportunity analysis',
        'Technology integration planning and vendor evaluation',
        'PE firm and investment partner networking platform',
        'Regulatory compliance tracking across multiple states',
        'Competitive intelligence and market positioning analysis'
      ],
      pt_consultant: [
        'Database of potential clients with contact information',
        'Market research tools and industry trend analysis',
        'Professional credentialing and case study portfolio',
        'Network of subject matter experts for project collaboration',
        'Client relationship and project management system',
        'Industry benchmarking data and analysis tools',
        'Speaking opportunity and thought leadership platform',
        'Referral partner network and relationship tracking',
        'Competitive analysis and market positioning tools',
        'Contract and proposal template library'
      ],
      healthcare_recruiter: [
        'Comprehensive PT candidate database with specializations',
        'Client company profiles with culture and compensation data',
        'Real-time salary and benefit benchmarking by market',
        'Passive candidate relationship management system',
        'Market intelligence on hiring trends and demands',
        'PT school partnership and new graduate pipeline',
        'Interview assessment tools and candidate evaluation',
        'Placement tracking and follow-up automation',
        'Competitor analysis and market positioning insights',
        'Regional market trend analysis and reporting'
      ],
      talent_leadership: [
        'Talent pipeline analytics and forecasting tools',
        'Comprehensive compensation benchmarking by role and market',
        'Retention prediction and early warning systems',
        'Skills gap analysis and training needs assessment',
        'PT school partnership and recruitment pipeline management',
        'Succession planning and leadership development tracking',
        'Employee engagement and satisfaction benchmarking',
        'Competitor talent intelligence and market analysis',
        'Performance management and career development pathways',
        'Benefits and perks benchmarking against industry standards'
      ],
      physical_therapist: [
        'Personalized career development planning and tracking',
        'Mentor matching with experienced PTs in your specialty',
        'Comprehensive continuing education catalog with reviews',
        'Professional networking groups by specialty and interest',
        'Job opportunity alerts matching your skills and preferences',
        'Salary negotiation tools and market rate information',
        'Professional portfolio and achievement tracking',
        'Research collaboration opportunities with peers',
        'Leadership and management development programs',
        'Work-life balance resources and peer support groups'
      ]
    };

    return roleFeatures[role] || [];
  };

  const handlePriorityChange = (feature: string, priority: number[]) => {
    onChange({
      feature_priorities: {
        ...data.feature_priorities,
        [feature]: priority[0]
      }
    });
  };

  const getPriorityLabel = (value: number) => {
    if (value <= 2) return 'Low Priority';
    if (value <= 4) return 'Medium Priority';
    return 'High Priority';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Solution Priorities</h2>
        <p className="text-muted-foreground mb-6">
          Which features would have the biggest impact on your daily work? Rate each based on how much time and frustration it would save you.
        </p>
      </div>

      <div className="space-y-6">
        {getFeatures().map((feature) => {
          const priority = data.feature_priorities[feature] || 3;

          return (
            <Card key={feature} className="p-5">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-foreground flex-1 pr-4">
                    {feature}
                  </h4>
                  <span className="text-sm font-medium text-primary">
                    {getPriorityLabel(priority)}
                  </span>
                </div>

                <div className="space-y-3">
                  <Slider
                    value={[priority]}
                    onValueChange={(value) => handlePriorityChange(feature, value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Not important</span>
                    <span>Somewhat important</span>
                    <span>Very important</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};