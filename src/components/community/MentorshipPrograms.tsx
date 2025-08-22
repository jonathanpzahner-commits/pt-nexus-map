
import { GraduationCap, TrendingUp, Users, Star, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mentors = [
  {
    id: 1,
    name: "Dr. Elena Rodriguez",
    title: "20+ years Sports PT",
    specialization: "Sports Medicine",
    rating: 4.9,
    sessions: 156,
    available: true
  },
  {
    id: 2,
    name: "Prof. David Kim",
    title: "Academic & Clinical Leader",
    specialization: "Geriatric PT",
    rating: 4.8,
    sessions: 203,
    available: true
  },
  {
    id: 3,
    name: "Dr. Rachel Foster",
    title: "Pediatric PT Director",
    specialization: "Pediatric Care",
    rating: 4.9,
    sessions: 89,
    available: false
  }
];

export const MentorshipPrograms = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Structured Programs */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Structured Mentorship Programs</h3>
        
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">New Graduate Success Program</h4>
                <p className="text-sm text-muted-foreground">6-month structured mentorship for new DPT graduates</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Program Duration</span>
                <span className="font-medium">6 months</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Participants</span>
                <span className="font-medium">234 mentees, 89 mentors</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Success Rate</span>
                <span className="font-medium text-green-600">94% completion</span>
              </div>
              <Button className="w-full mt-4">Join as Mentee</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Leadership Development Track</h4>
                <p className="text-sm text-muted-foreground">12-month program for emerging PT leaders</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Program Duration</span>
                <span className="font-medium">12 months</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Requirements</span>
                <span className="font-medium">3+ years experience</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Next Cohort</span>
                <span className="font-medium">April 2024</span>
              </div>
              <Button variant="outline" className="w-full mt-4">Apply Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Mentors */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Connect with Expert Mentors</h3>
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{mentor.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{mentor.title}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{mentor.specialization}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      {mentor.rating} rating
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      {mentor.sessions} sessions
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      className={mentor.available ? "bg-gradient-primary text-white" : ""} 
                      variant={mentor.available ? "default" : "outline"}
                      disabled={!mentor.available}
                    >
                      {mentor.available ? "Schedule Session" : "Unavailable"}
                    </Button>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
