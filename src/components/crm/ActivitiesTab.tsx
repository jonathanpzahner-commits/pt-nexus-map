import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, Mail, Calendar, FileText, Clock } from "lucide-react";

export function ActivitiesTab() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - replace with actual data from Supabase
  const activities = [
    {
      id: "1",
      type: "call",
      subject: "Follow-up call with John Smith",
      description: "Discussed project requirements and timeline",
      contactName: "John Smith",
      company: "Tech Solutions Inc",
      activityDate: "2024-01-15T14:30:00Z",
      duration: 45,
      status: "completed",
      outcome: "Scheduled proposal presentation"
    },
    {
      id: "2",
      type: "email",
      subject: "Proposal sent to HealthTech Corp",
      description: "Sent detailed proposal with pricing and timeline",
      contactName: "Sarah Johnson",
      company: "HealthTech Corp",
      activityDate: "2024-01-14T10:15:00Z",
      status: "completed",
      outcome: "Awaiting response"
    },
    {
      id: "3",
      type: "meeting",
      subject: "Discovery meeting with RehabPlus",
      description: "Initial consultation and needs assessment",
      contactName: "Michael Brown",
      company: "RehabPlus",
      activityDate: "2024-01-12T15:00:00Z",
      duration: 60,
      status: "completed",
      outcome: "Qualified as potential customer"
    },
    {
      id: "4",
      type: "task",
      subject: "Prepare contract for PT Clinic Network",
      description: "Draft contract terms and conditions",
      contactName: "Lisa Davis",
      company: "PT Clinic Network",
      activityDate: "2024-01-16T09:00:00Z",
      status: "scheduled",
      outcome: null
    }
  ];

  const filteredActivities = activities.filter(activity =>
    activity.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call": return Phone;
      case "email": return Mail;
      case "meeting": return Calendar;
      case "task": return FileText;
      default: return FileText;
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "call": return "bg-green-100 text-green-800";
      case "email": return "bg-blue-100 text-blue-800";
      case "meeting": return "bg-purple-100 text-purple-800";
      case "task": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      </div>

      <div className="space-y-4">
        {filteredActivities.map((activity) => {
          const ActivityIcon = getActivityIcon(activity.type);
          const { date, time } = formatDateTime(activity.activityDate);
          
          return (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                    <ActivityIcon className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{activity.subject}</h3>
                          <Badge className={getActivityTypeColor(activity.type)}>
                            {activity.type}
                          </Badge>
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{activity.contactName} - {activity.company}</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{date} at {time}</span>
                      </div>
                      {activity.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{activity.duration} min</span>
                        </div>
                      )}
                    </div>
                    
                    {activity.outcome && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                        <strong>Outcome:</strong> {activity.outcome}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}