import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';

interface ToolsAndPricingStepProps {
  role: string;
  data: any;
  onChange: (updates: any) => void;
}

export const ToolsAndPricingStep = ({ role, data, onChange }: ToolsAndPricingStepProps) => {
  const getTools = () => {
    const commonTools = [
      'LinkedIn',
      'Excel/Google Sheets',
      'CRM software',
      'Email marketing tools',
      'Industry publications',
      'Professional associations'
    ];

    const roleTools: Record<string, string[]> = {
      pt_owner: [
        'Practice management software',
        'EMR/EHR systems',
        'Scheduling software',
        'Financial management tools',
        ...commonTools
      ],
      pt_ceo_coo: [
        'Business intelligence tools',
        'Project management software',
        'Performance dashboards',
        'Multi-location management systems',
        ...commonTools
      ],
      pt_consultant: [
        'Market research tools',
        'Presentation software',
        'Project management tools',
        'Client relationship management',
        ...commonTools
      ],
      healthcare_recruiter: [
        'Applicant tracking systems',
        'Job boards',
        'Social recruiting tools',
        'Background check services',
        ...commonTools
      ],
      talent_leadership: [
        'HRIS systems',
        'Performance management software',
        'Compensation analysis tools',
        'Learning management systems',
        ...commonTools
      ],
      physical_therapist: [
        'Continuing education platforms',
        'Job search websites',
        'Professional networking apps',
        'Clinical reference tools',
        ...commonTools
      ]
    };

    return [...(roleTools[role] || []), 'None of the above', 'Other (please specify in comments)'];
  };

  const getPricingOptions = () => {
    const baseOptions = [
      { value: 'free', label: 'Free only' },
      { value: 'under_50', label: 'Under $50/month' },
      { value: '50_100', label: '$50-100/month' },
      { value: '100_250', label: '$100-250/month' },
      { value: '250_500', label: '$250-500/month' },
      { value: 'over_500', label: 'Over $500/month' },
      { value: 'not_interested', label: 'Not interested in paid solutions' }
    ];

    if (role === 'physical_therapist') {
      return [
        { value: 'free', label: 'Free only' },
        { value: 'under_25', label: 'Under $25/month' },
        { value: '25_50', label: '$25-50/month' },
        { value: '50_100', label: '$50-100/month' },
        { value: 'over_100', label: 'Over $100/month' },
        { value: 'not_interested', label: 'Not interested in paid solutions' }
      ];
    }

    return baseOptions;
  };

  const handleToolToggle = (tool: string, checked: boolean) => {
    const newTools = checked 
      ? [...data.tools_currently_used, tool]
      : data.tools_currently_used.filter((t: string) => t !== tool);
    
    onChange({ tools_currently_used: newTools });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Current Tools & Pricing</h2>
        <p className="text-muted-foreground mb-6">
          Help us understand what you're currently using and what you'd be willing to invest in better solutions.
        </p>
      </div>

      {/* Current Tools */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">What tools do you currently use for your work?</h3>
        <p className="text-sm text-muted-foreground">Select all that apply</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {getTools().map((tool) => (
            <div key={tool} className="flex items-center space-x-3">
              <Checkbox
                id={tool}
                checked={data.tools_currently_used.includes(tool)}
                onCheckedChange={(checked) => 
                  handleToolToggle(tool, checked as boolean)
                }
              />
              <Label htmlFor={tool} className="cursor-pointer">
                {tool}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            What would you be willing to pay for a comprehensive platform that addresses your key challenges?
          </h3>
          <p className="text-sm text-muted-foreground">
            Consider a solution that combines networking, industry intelligence, vendor management, and professional tools.
          </p>
          
          <RadioGroup
            value={data.pricing_willingness}
            onValueChange={(value) => onChange({ pricing_willingness: value })}
            className="space-y-3"
          >
            {getPricingOptions().map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Card>
    </div>
  );
};