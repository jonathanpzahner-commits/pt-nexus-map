
import { Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const researchCollaborations = [
  {
    id: 1,
    title: "Multi-center study on AI-assisted gait analysis",
    leader: "Dr. Jennifer Walsh, PhD",
    institution: "Stanford University",
    participants: 12,
    status: "Recruiting",
    funding: "$250K NIH Grant",
    specialties: ["Biomechanics", "AI/ML", "Gait Analysis"],
    duration: "18 months"
  },
  {
    id: 2,
    title: "Telehealth effectiveness in rural PT populations",
    leader: "Prof. Michael Chen",
    institution: "University of Michigan", 
    participants: 8,
    status: "Data Collection",
    funding: "Industry Sponsored",
    specialties: ["Telehealth", "Rural Health", "Outcomes Research"],
    duration: "12 months"
  },
  {
    id: 3,
    title: "VR-based rehabilitation protocols for stroke recovery",
    leader: "Dr. Sarah Kim, DPT, PhD",
    institution: "Mayo Clinic",
    participants: 15,
    status: "Protocol Development",
    funding: "$180K Foundation Grant",
    specialties: ["Neurology", "VR Technology", "Stroke Recovery"],
    duration: "24 months"
  }
];

export const ResearchCollaborations = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Active Research Collaborations</h3>
        <Button className="bg-gradient-primary text-white">
          <Lightbulb className="h-4 w-4 mr-2" />
          Propose Research
        </Button>
      </div>

      {researchCollaborations.map((research) => (
        <Card key={research.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foreground mb-2">{research.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="font-medium">{research.leader}</span>
                    <span>•</span>
                    <span>{research.institution}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {research.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>
                
                <Badge className={`ml-4 ${
                  research.status === 'Recruiting' ? 'bg-green-100 text-green-800' :
                  research.status === 'Data Collection' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {research.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Participants</span>
                  <div className="font-medium">{research.participants} joined</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration</span>
                  <div className="font-medium">{research.duration}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Funding</span>
                  <div className="font-medium">{research.funding}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Learn More</Button>
                  {research.status === 'Recruiting' && (
                    <Button size="sm" className="bg-green-600 text-white">Join Study</Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
