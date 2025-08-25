import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Gift, Users, Zap } from 'lucide-react';

interface BetaInterestStepProps {
  role: string;
  data: any;
  onChange: (updates: any) => void;
}

export const BetaInterestStep = ({ role, data, onChange }: BetaInterestStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Help Us Build This</h2>
        <p className="text-muted-foreground mb-6">
          Your insights are invaluable. Join our beta program to shape this platform and get early access.
        </p>
      </div>

      {/* Beta Interest */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="beta_interest"
              checked={data.beta_interest}
              onCheckedChange={(checked) => onChange({ beta_interest: checked })}
            />
            <Label htmlFor="beta_interest" className="text-lg font-semibold cursor-pointer">
              Yes, I want early access and to help shape this platform!
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center space-x-3">
              <Gift className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Free Beta Access</p>
                <p className="text-sm text-muted-foreground">6 months free + priority pricing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Direct Input</p>
                <p className="text-sm text-muted-foreground">Help prioritize features you need</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">First-Mover Advantage</p>
                <p className="text-sm text-muted-foreground">Be first to benefit from the network</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      {data.beta_interest && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <p className="text-sm text-muted-foreground">
              We'll reach out with beta access and updates. Your information will never be shared.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Full Name *</Label>
                <Input
                  id="contact_name"
                  value={data.contact_name}
                  onChange={(e) => onChange({ contact_name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email Address *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={data.contact_email}
                  onChange={(e) => onChange({ contact_email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Additional Comments */}
      <div className="space-y-4">
        <Label htmlFor="additional_comments">
          Final thoughts or specific needs we should prioritize? (Optional)
        </Label>
        <Textarea
          id="additional_comments"
          value={data.additional_comments}
          onChange={(e) => onChange({ additional_comments: e.target.value })}
          placeholder="Any specific features, pain points, or requirements you'd like us to focus on first..."
          rows={4}
        />
      </div>
    </div>
  );
};