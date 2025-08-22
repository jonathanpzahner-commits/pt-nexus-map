
import { Network, Users, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const professionalGroups = [
  {
    id: 1,
    name: "Advanced Orthopedic Specialists",
    members: 2847,
    description: "Elite group for board-certified orthopedic PTs sharing cutting-edge techniques",
    requirements: "Board certification + 5+ years experience",
    activity: "Daily",
    privacy: "Private"
  },
  {
    id: 2,
    name: "Emerging Technology in PT",
    members: 1289,
    description: "Exploring AI, VR, robotics, and digital health innovations in physical therapy",
    requirements: "Open to all with tech interest",
    activity: "Very High",
    privacy: "Public"
  },
  {
    id: 3,
    name: "Rural & Underserved Communities PT",
    members: 756,
    description: "Addressing unique challenges in providing PT services to underserved populations",
    requirements: "Experience in rural/underserved settings",
    activity: "Moderate",
    privacy: "Semi-Private"
  },
  {
    id: 4,
    name: "PT Practice Owners & Entrepreneurs",
    members: 1534,
    description: "Business strategies, operational excellence, and growth tactics for PT practice owners",
    requirements: "Practice owner or senior management",
    activity: "High",
    privacy: "Private"
  }
];

export const ProfessionalNetworking = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Network className="h-16 w-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-4">Professional Networking Groups</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join specialized groups to connect with peers in your area of expertise, 
          share knowledge, and build meaningful professional relationships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {professionalGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-foreground">{group.name}</h4>
                      <Badge variant={group.privacy === 'Private' ? 'default' : 'outline'}>
                        {group.privacy}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Members</span>
                    <div className="font-medium text-foreground">{group.members.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Activity Level</span>
                    <div className="font-medium text-foreground">{group.activity}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-xs text-muted-foreground mb-3">
                    <strong>Requirements:</strong> {group.requirements}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Learn More</Button>
                    <Button 
                      size="sm" 
                      className={group.privacy === 'Private' ? 'bg-gradient-primary text-white' : 'bg-green-600 text-white'}
                    >
                      {group.privacy === 'Private' ? 'Request Access' : 'Join Group'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Networking Features */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold mb-6 text-center">Additional Networking Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg bg-white/50 dark:bg-gray-800/50">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Regional Chapters</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with PTs in your geographic area for local meetups and collaborations
              </p>
              <Button variant="outline" size="sm">Find Local Chapter</Button>
            </div>
            <div className="text-center p-4 border rounded-lg bg-white/50 dark:bg-gray-800/50">
              <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Direct Messaging</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Private conversations with fellow professionals for collaboration and advice
              </p>
              <Button variant="outline" size="sm">Start Conversation</Button>
            </div>
            <div className="text-center p-4 border rounded-lg bg-white/50 dark:bg-gray-800/50">
              <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Professional Events</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Discover and organize professional development events and networking mixers
              </p>
              <Button variant="outline" size="sm">Browse Events</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
