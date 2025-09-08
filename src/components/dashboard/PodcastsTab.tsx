import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Play, Clock, Calendar, ExternalLink } from 'lucide-react';

export const PodcastsTab = () => {
  const featuredPodcasts = [
    {
      title: "PT Talk: Modern Practice Management",
      host: "Dr. Sarah Martinez",
      duration: "45 min",
      date: "Dec 15, 2024",
      description: "Exploring innovative approaches to practice management and patient care in modern physical therapy clinics.",
      topics: ["Practice Management", "Patient Care", "Technology"],
      listens: "12.4K"
    },
    {
      title: "Movement Science Weekly",
      host: "Dr. Michael Chen",
      duration: "32 min", 
      date: "Dec 12, 2024",
      description: "Deep dive into the latest research on movement patterns and rehabilitation techniques.",
      topics: ["Research", "Movement Science", "Rehabilitation"],
      listens: "8.7K"
    },
    {
      title: "The Business of PT",
      host: "Jennifer Thompson, DPT",
      duration: "28 min",
      date: "Dec 10, 2024", 
      description: "Strategies for growing your physical therapy practice and building a sustainable business model.",
      topics: ["Business", "Growth", "Strategy"],
      listens: "15.2K"
    }
  ];

  const categories = [
    { name: "Clinical Practice", count: 47 },
    { name: "Business & Leadership", count: 23 },
    { name: "Research & Evidence", count: 31 },
    { name: "Technology & Innovation", count: 19 },
    { name: "Professional Development", count: 35 },
    { name: "Patient Stories", count: 12 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mic className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">PT Podcasts & Audio Content</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">167</p>
                <p className="text-sm text-muted-foreground">Total Episodes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Play className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">89.4K</p>
                <p className="text-sm text-muted-foreground">Total Listens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">42</p>
                <p className="text-sm text-muted-foreground">Avg Minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">New This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Featured Podcasts */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Featured Episodes</h3>
          
          {featuredPodcasts.map((podcast, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{podcast.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">Hosted by {podcast.host}</p>
                    <p className="text-sm text-muted-foreground mb-3">{podcast.description}</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-4">
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {podcast.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {podcast.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {podcast.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    {podcast.listens} listens
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="text-center">
            <Button variant="outline">
              View All Episodes
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Browse Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                    <Badge variant="outline" className="text-xs">{category.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Podcast */}
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Podcast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Share your PT podcast with our community of professionals.
              </p>
              <Button className="w-full">
                <Mic className="h-4 w-4 mr-2" />
                Submit Podcast
              </Button>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["Manual Therapy", "Dry Needling", "Telehealth", "AI in PT", "Value-Based Care"].map((topic) => (
                  <Badge key={topic} variant="outline" className="mr-2 mb-2">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};