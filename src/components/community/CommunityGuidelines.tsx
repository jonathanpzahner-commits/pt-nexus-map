
import { Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const communityRules = [
  {
    id: 1,
    title: "Professional Conduct",
    description: "Maintain respectful, professional communication at all times. Personal attacks, harassment, or discriminatory language will result in immediate removal."
  },
  {
    id: 2,
    title: "Patient Privacy (HIPAA Compliance)",
    description: "Never share identifiable patient information. All case discussions must be completely de-identified and hypothetical."
  },
  {
    id: 3,
    title: "No Medical Advice",
    description: "Do not provide specific medical advice or treatment recommendations for individual patients. General educational discussions are encouraged."
  },
  {
    id: 4,
    title: "Evidence-Based Practice",
    description: "Support claims with credible sources. When sharing research or treatment approaches, include references and acknowledge limitations."
  },
  {
    id: 5,
    title: "Stay On Topic",
    description: "Keep discussions relevant to physical therapy practice, education, or professional development. Off-topic posts will be moved or removed."
  },
  {
    id: 6,
    title: "No Spam or Self-Promotion",
    description: "Excessive self-promotion, affiliate links, or unrelated business promotion is prohibited. Share resources that benefit the community."
  },
  {
    id: 7,
    title: "Verify Information",
    description: "Double-check facts before sharing. Misinformation can harm patient care. When uncertain, ask for clarification or sources."
  },
  {
    id: 8,
    title: "Respect Scope of Practice",
    description: "Acknowledge professional boundaries and scope limitations. Refer to appropriate specialists when discussions exceed PT scope."
  }
];

export const CommunityGuidelines = () => {
  return (
    <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Award className="h-5 w-5" />
          Community Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-amber-700 dark:text-amber-300 mb-4">
          Our community thrives on professional excellence and mutual respect. Please review and follow these guidelines:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityRules.map((rule) => (
            <div key={rule.id} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {rule.id}
                </span>
                {rule.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
