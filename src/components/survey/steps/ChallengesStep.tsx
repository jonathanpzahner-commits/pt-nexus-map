import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface ChallengesStepProps {
  role: string;
  data: any;
  onChange: (updates: any) => void;
}

export const ChallengesStep = ({ role, data, onChange }: ChallengesStepProps) => {
  const getChallenges = () => {
    const roleChallenges: Record<string, string[]> = {
      pt_owner: [
        'Finding and retaining qualified PTs and support staff',
        'Managing relationships with multiple equipment vendors',
        'Tracking and comparing supplier pricing and contracts',
        'Staying competitive with larger clinic chains',
        'Understanding local market rates and competitor strategies',
        'Finding reliable continuing education providers for staff',
        'Networking with other practice owners for best practices',
        'Managing patient referral relationships with physicians',
        'Keeping up with insurance reimbursement changes',
        'Finding and evaluating new practice management software'
      ],
      pt_ceo_coo: [
        'Coordinating operations across multiple clinic locations',
        'Developing standardized protocols across all sites',
        'Analyzing performance metrics across different markets',
        'Managing vendor relationships and contracts at scale',
        'Recruiting leadership talent for expansion',
        'Staying ahead of industry consolidation trends',
        'Implementing technology solutions across locations',
        'Managing relationships with PE firms or investors',
        'Benchmarking performance against industry standards',
        'Planning strategic acquisitions and market expansion'
      ],
      pt_consultant: [
        'Finding new clients who need consulting services',
        'Building credibility and reputation in the market',
        'Staying current with industry trends and changes',
        'Accessing reliable market research and data',
        'Networking with potential clients and referral sources',
        'Differentiating from other consultants and firms',
        'Understanding client pain points and needs deeply',
        'Managing multiple client relationships effectively',
        'Pricing services competitively yet profitably',
        'Finding subject matter experts for specialized projects'
      ],
      healthcare_recruiter: [
        'Sourcing qualified PT candidates in a tight market',
        'Understanding client practice culture and specific needs',
        'Keeping up with salary trends and market rates',
        'Building relationships with passive candidates',
        'Competing with internal recruiters and other agencies',
        'Understanding different PT specializations and requirements',
        'Managing candidate expectations vs client requirements',
        'Building a pipeline of quality candidates',
        'Staying connected with placed candidates for referrals',
        'Understanding regional market differences and trends'
      ],
      talent_leadership: [
        'Building a strong pipeline of PT talent',
        'Understanding market compensation trends',
        'Reducing turnover and improving retention',
        'Competing with other employers for top talent',
        'Identifying skills gaps and training needs',
        'Building relationships with PT schools and programs',
        'Managing succession planning for key roles',
        'Creating attractive career development paths',
        'Benchmarking benefits and compensation packages',
        'Understanding what motivates PT professionals today'
      ],
      physical_therapist: [
        'Finding the right career opportunities and advancement paths',
        'Staying current with evidence-based practices and research',
        'Networking with other PTs in my specialty area',
        'Finding quality continuing education and certification programs',
        'Understanding salary ranges and negotiating compensation',
        'Building professional relationships and mentorships',
        'Finding opportunities to specialize or change practice areas',
        'Staying informed about industry trends and changes',
        'Balancing work-life integration and avoiding burnout',
        'Finding leadership and management development opportunities'
      ]
    };

    return roleChallenges[role] || [];
  };

  const handleChallengeToggle = (challenge: string, checked: boolean) => {
    const newChallenges = checked 
      ? [...data.current_challenges, challenge]
      : data.current_challenges.filter((c: string) => c !== challenge);
    
    onChange({ current_challenges: newChallenges });
  };

  const handleSeverityChange = (challenge: string, severity: number[]) => {
    onChange({
      pain_point_severity: {
        ...data.pain_point_severity,
        [challenge]: severity[0]
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Biggest Challenges</h2>
        <p className="text-muted-foreground mb-6">
          What challenges consume most of your time and energy? Select all that apply and rate how much they impact your success.
        </p>
      </div>

      <div className="space-y-4">
        {getChallenges().map((challenge) => {
          const isSelected = data.current_challenges.includes(challenge);
          const severity = data.pain_point_severity[challenge] || 3;

          return (
            <Card key={challenge} className={`p-4 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={challenge}
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      handleChallengeToggle(challenge, checked as boolean)
                    }
                  />
                  <Label htmlFor={challenge} className="flex-1 cursor-pointer">
                    {challenge}
                  </Label>
                </div>

                {isSelected && (
                  <div className="ml-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Impact Level:</span>
                      <span className="font-medium">
                        {severity <= 2 ? 'Low' : severity <= 4 ? 'Medium' : 'High'}
                      </span>
                    </div>
                    <Slider
                      value={[severity]}
                      onValueChange={(value) => handleSeverityChange(challenge, value)}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Minor issue</span>
                      <span>Critical issue</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};