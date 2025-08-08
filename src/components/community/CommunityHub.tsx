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
  Award
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

  const newsItems = [
    {
      id: 1,
      title: "New APTA Guidelines Released for Telehealth PT Services",
      source: "APTA News",
      time: "3 hours ago",
      category: "Regulation",
      image: "/api/placeholder/80/60"
    },
    {
      id: 2,
      title: "AI-Powered Gait Analysis Shows Promise in Clinical Trials",
      source: "PT Research Journal",
      time: "6 hours ago",
      category: "Technology",
      image: "/api/placeholder/80/60"
    },
    {
      id: 3,
      title: "Medicare Changes Affect PT Reimbursement Rates",
      source: "Healthcare Finance",
      time: "1 day ago",
      category: "Finance",
      image: "/api/placeholder/80/60"
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

  const categories = [
    { name: "Orthopedics", count: 156, color: "from-blue-500 to-cyan-500" },
    { name: "Neurology", count: 89, color: "from-purple-500 to-violet-500" },
    { name: "Sports Medicine", count: 134, color: "from-green-500 to-emerald-500" },
    { name: "Pediatrics", count: 67, color: "from-orange-500 to-amber-500" },
    { name: "Geriatrics", count: 78, color: "from-pink-500 to-rose-500" },
    { name: "Practice Management", count: 45, color: "from-teal-500 to-cyan-500" }
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

      {/* Community Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Discussions</span>
          </TabsTrigger>
          <TabsTrigger value="mentorship" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Mentorship</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">Industry News</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{mentor.name}</h4>
                      <p className="text-sm text-muted-foreground">{mentor.title}</p>
                      <Badge variant="outline" className="mt-2">{mentor.specialization}</Badge>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        {mentor.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        {mentor.sessions} sessions
                      </div>
                    </div>
                    <Button 
                      className={mentor.available ? "bg-gradient-primary text-white w-full" : "w-full"} 
                      variant={mentor.available ? "default" : "outline"}
                      disabled={!mentor.available}
                    >
                      {mentor.available ? (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Connect
                        </>
                      ) : (
                        'Not Available'
                      )}
                    </Button>
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
          <Card className="p-8 text-center">
            <CardContent>
              <Network className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Professional Networking</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Connect with PT professionals in your area, find collaboration opportunities, 
                and build meaningful professional relationships that advance your career.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="p-4 border rounded-lg">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Local Groups</h4>
                  <p className="text-sm text-muted-foreground">Join PT groups in your geographic area</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Calendar className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Events</h4>
                  <p className="text-sm text-muted-foreground">Discover conferences and meetups</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <MessageSquare className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Collaborations</h4>
                  <p className="text-sm text-muted-foreground">Find research and project partners</p>
                </div>
              </div>
              <Button className="mt-6 bg-gradient-primary text-white">
                <Network className="h-4 w-4 mr-2" />
                Start Networking
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};