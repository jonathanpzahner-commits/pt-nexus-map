
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const upcomingEvents = [
  {
    id: 1,
    title: "Advanced Manual Therapy Techniques Workshop",
    date: "March 15, 2024",
    time: "9:00 AM - 5:00 PM EST",
    type: "Hands-on Workshop",
    presenter: "Dr. Lisa Rodriguez, FAAOMPT",
    attendees: 156,
    maxCapacity: 200,
    ceuCredits: 8,
    cost: "$299",
    location: "Virtual + Regional Centers"
  },
  {
    id: 2,
    title: "Pediatric PT Grand Rounds: Complex Cases",
    date: "March 18, 2024",
    time: "12:00 PM - 1:30 PM EST", 
    type: "Case Discussion",
    presenter: "Children's Hospital PT Team",
    attendees: 89,
    maxCapacity: 150,
    ceuCredits: 1.5,
    cost: "Free",
    location: "Virtual"
  },
  {
    id: 3,
    title: "Sports PT Injury Prevention Summit",
    date: "March 22, 2024",
    time: "8:00 AM - 6:00 PM EST",
    type: "Conference",
    presenter: "Multiple Expert Speakers",
    attendees: 340,
    maxCapacity: 500,
    ceuCredits: 10,
    cost: "$449",
    location: "Phoenix, AZ + Virtual"
  }
];

export const CommunityEvents = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Upcoming Professional Events</h3>
        <Button className="bg-gradient-primary text-white">
          <Calendar className="h-4 w-4 mr-2" />
          Host Event
        </Button>
      </div>

      {upcomingEvents.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="text-center min-w-20">
                <div className="text-2xl font-bold text-primary">{event.date.split(' ')[1].replace(',', '')}</div>
                <div className="text-sm text-muted-foreground">{event.date.split(' ')[0]}</div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-1">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">Presented by {event.presenter}</p>
                  </div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">Time</span>
                    <div className="font-medium">{event.time}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Attendees</span>
                    <div className="font-medium">{event.attendees}/{event.maxCapacity}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CEU Credits</span>
                    <div className="font-medium">{event.ceuCredits} hours</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost</span>
                    <div className="font-medium">{event.cost}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    📍 {event.location}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Learn More</Button>
                    <Button size="sm" className="bg-gradient-primary text-white">Register</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
