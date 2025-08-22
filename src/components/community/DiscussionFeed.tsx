
import { MessageSquare, TrendingUp, Clock, Reply, Heart, Users, Share } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

export const DiscussionFeed = () => {
  return (
    <div className="space-y-4">
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
  );
};
