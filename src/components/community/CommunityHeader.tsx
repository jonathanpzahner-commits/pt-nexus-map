
import { Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CommunityHeaderProps {
  memberCount: string;
  weeklyGrowth: string;
}

export const CommunityHeader = ({ memberCount, weeklyGrowth }: CommunityHeaderProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-8 border border-primary/20">
      <div className="flex items-center justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
              <Network className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              PT Community Hub
            </h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Connect, learn, and grow with thousands of physical therapy professionals. 
            Share knowledge, find mentors, and stay updated with industry trends.
          </p>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-display font-bold text-foreground">{memberCount}</div>
          <div className="text-sm text-muted-foreground">Active Members</div>
          <Badge className="mt-2 bg-green-500/10 text-green-600 border-green-500/20">
            {weeklyGrowth} this week
          </Badge>
        </div>
      </div>
    </div>
  );
};
