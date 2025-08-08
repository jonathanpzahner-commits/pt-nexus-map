import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  Heart,
  Reply,
  Share,
  Star,
  UserPlus,
  Calendar,
  Newspaper,
  Network,
  Lightbulb,
  Award,
  GraduationCap
} from 'lucide-react';

export const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('discussions');

  // Mock data for demo - in real app this would come from Supabase
  const discussions = [
    {
      id: 1,
      title: "Best practices for post-surgical knee rehabilitation",
      author: "Dr. Sarah Chen",
      authorTitle: "Orthopedic PT Specialist",
      category: "Orthopedics",
      replies: 24,
      likes: 18,
      views: 342,
      lastActivity: "2 hours ago",
      trending: true
    },
    {
      id: 2,
      title: "New research on neuroplasticity in stroke recovery",
      author: "Marcus Rodriguez",
      authorTitle: "Neurological PT",
      category: "Neurology",
      replies: 31,
      likes: 45,
      views: 567,
      lastActivity: "4 hours ago",
      trending: true
    },
    {
      id: 3,
      title: "EMR integration challenges - seeking advice",
      author: "Jennifer Park",
      authorTitle: "Clinic Director",
      category: "Practice Management",
      replies: 12,
      likes: 8,
      views: 189,
      lastActivity: "1 day ago",
      trending: false
    },
    {
      id: 4,
      title: "Pediatric PT techniques for sensory processing",
      author: "Dr. Michael Thompson",
      authorTitle: "Pediatric Specialist",
      category: "Pediatrics",
      replies: 19,
      likes: 27,
      views: 298,
      lastActivity: "1 day ago",
      trending: false
    }
  ];

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

  const newsItems = [
    {
      id: 1,
      title: "New APTA Guidelines Released for Telehealth PT Services",
      source: "APTA News",
      time: "3 hours ago",
      category: "Regulation"
    },
    {
      id: 2,
      title: "AI-Powered Gait Analysis Shows Promise in Clinical Trials",
      source: "PT Research Journal",
      time: "6 hours ago",
      category: "Technology"
    },
    {
      id: 3,
      title: "Medicare Changes Affect PT Reimbursement Rates",
      source: "Healthcare Finance",
      time: "1 day ago",
      category: "Finance"
    }
  ];

  const categories = [
    { name: "Orthopedics", count: 156, color: "from-blue-500 to-cyan-500" },
    { name: "Neurology", count: 89, color: "from-purple-500 to-violet-500" },
    { name: "Sports Medicine", count: 134, color: "from-green-500 to-emerald-500" },
    { name: "Pediatrics", count: 67, color: "from-orange-500 to-amber-500" },
    { name: "Geriatrics", count: 78, color: "from-pink-500 to-rose-500" },
    { name: "Practice Management", count: 45, color: "from-teal-500 to-cyan-500" }
  ];

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

  return (
    <div className="space-y-8">
      {/* Community Header */}
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
            <div className="text-3xl font-display font-bold text-foreground">12.4K</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
            <Badge className="mt-2 bg-green-500/10 text-green-600 border-green-500/20">
              +234 this week
            </Badge>
          </div>
        </div>
      </div>

      {/* Community Rules Card */}
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

      {/* Community Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 h-12">
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Discussions</span>
          </TabsTrigger>
          <TabsTrigger value="mentorship" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Mentorship</span>
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Research</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
          <TabsTrigger value="networking" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            <span className="hidden sm:inline">Networking</span>
          </TabsTrigger>
        </TabsList>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Discussion Categories */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Discussion Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categories.map((category) => (
                    <div 
                      key={category.name}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`}></div>
                        <span className="font-medium text-foreground">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Discussion Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">Recent Discussions</h3>
                <Button className="bg-gradient-primary text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Discussion
                </Button>
              </div>

              {discussions.map((discussion) => (
                <Card key={discussion.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {discussion.trending && (
                              <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                            <Badge variant="outline">{discussion.category}</Badge>
                          </div>
                          <h4 className="text-lg font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                            {discussion.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium">{discussion.author}</span>
                            <span>•</span>
                            <span>{discussion.authorTitle}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {discussion.lastActivity}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Reply className="h-4 w-4" />
                            {discussion.replies} replies
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {discussion.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {discussion.views} views
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Mentorship Tab */}
        <TabsContent value="mentorship" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mentorship Programs */}
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
                        <Badge variant="outline" className="mb-3">{mentor.specialization}</Badge>
                        
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
        </TabsContent>

        {/* Research Collaboration Tab */}
        <TabsContent value="research" className="space-y-6">
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
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
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
        </TabsContent>

        {/* Industry News Tab */}
        <TabsContent value="news" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Latest Industry News</h3>
            {newsItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-15 bg-muted rounded-lg flex items-center justify-center">
                      <Newspaper className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <span className="text-sm text-muted-foreground">{item.time}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Source: {item.source}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Networking Tab */}
        <TabsContent value="networking" className="space-y-6">
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

            {/* Professional Networking Features */}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};