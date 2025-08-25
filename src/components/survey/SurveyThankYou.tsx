import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Linkedin } from 'lucide-react';

interface SurveyThankYouProps {
  role: string;
}

export const SurveyThankYou = ({ role }: SurveyThankYouProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              Thank You!
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Your responses have been recorded and will help us build a platform 
              that truly serves the physical therapy community.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-foreground">What happens next?</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li>• We'll analyze your feedback with hundreds of other responses</li>
                <li>• Priority beta access if you signed up</li>
                <li>• Platform development based on your actual needs</li>
                <li>• Launch updates shared with survey participants first</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Have colleagues who would benefit from this? Share the survey:
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = window.location.href.replace('/survey/' + role, '/survey/pt_owner');
                    navigator.clipboard.writeText(url);
                  }}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Copy Link
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text = "Help shape the future of PT healthcare - quick 7min survey for PT professionals";
                    const url = window.location.href.replace('/survey/' + role, '/survey/pt_owner');
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`);
                  }}
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  Share on LinkedIn
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};