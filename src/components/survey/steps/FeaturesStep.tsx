import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface FeaturesStepProps {
  role: string;
  data: any;
  onChange: (updates: any) => void;
}

export const FeaturesStep = ({ role, data, onChange }: FeaturesStepProps) => {
  const getFeatures = () => {
    const commonFeatures = [
      'Professional networking and connections',
      'Industry news and trends tracking',
      'Vendor and supplier directory',
      'Job listings and career opportunities',
      'Educational resources and events'
    ];

    const roleFeatures: Record<string, string[]> = {
      pt_owner: [
        'Practice management tools',
        'Equipment and supplier sourcing',
        'Staff recruitment platform',
        'Financial benchmarking',
        'Competitor analysis tools',
        ...commonFeatures
      ],
      pt_ceo_coo: [
        'Multi-location management dashboard',
        'Performance analytics and reporting',
        'Strategic planning resources',
        'Regulatory compliance tracking',
        'Technology integration marketplace',
        ...commonFeatures
      ],
      pt_consultant: [
        'Client prospect database',
        'Market research tools',
        'Professional credentialing system',
        'Project management features',
        'Client relationship tracking',
        ...commonFeatures
      ],
      healthcare_recruiter: [
        'Candidate database and search',
        'Client company profiles',
        'Salary benchmarking tools',
        'Interview and assessment tools',
        'Market trend analysis',
        ...commonFeatures
      ],
      talent_leadership: [
        'Talent pipeline analytics',
        'Compensation benchmarking',
        'Retention prediction tools',
        'Skills gap analysis',
        'Succession planning features',
        ...commonFeatures
      ],
      physical_therapist: [
        'Career development tracking',
        'Mentorship matching',
        'Continuing education catalog',
        'Professional portfolio builder',
        'Peer networking groups',
        ...commonFeatures
      ]
    };

    return roleFeatures[role] || commonFeatures;
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
        <h2 className="text-2xl font-bold mb-4">Feature Priorities</h2>
        <p className="text-muted-foreground mb-6">
          Rate how important each feature would be for your daily work. This helps us prioritize development.
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