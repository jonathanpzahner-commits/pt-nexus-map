
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Users, 
  Lightbulb,
  Calendar,
  Newspaper,
  Network
} from 'lucide-react';
import { CommunityHeader } from './CommunityHeader';
import { CommunityGuidelines } from './CommunityGuidelines';
import { DiscussionCategories } from './DiscussionCategories';
import { DiscussionFeed } from './DiscussionFeed';
import { MentorshipPrograms } from './MentorshipPrograms';
import { ResearchCollaborations } from './ResearchCollaborations';
import { CommunityEvents } from './CommunityEvents';
import { IndustryNews } from './IndustryNews';
import { ProfessionalNetworking } from './ProfessionalNetworking';
import { OnlineColleagues } from './OnlineColleagues';

export const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('discussions');

  return (
    <div className="space-y-8">
      <CommunityHeader memberCount="12.4K" weeklyGrowth="+234" />
      <OnlineColleagues />
      <CommunityGuidelines />

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
            <span className="hidden sm:inline">Colleagues</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DiscussionCategories />
            </div>
            <div className="lg:col-span-2">
              <DiscussionFeed />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-6">
          <MentorshipPrograms />
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <ResearchCollaborations />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <CommunityEvents />
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <IndustryNews />
        </TabsContent>

        <TabsContent value="networking" className="space-y-6">
          <ProfessionalNetworking />
        </TabsContent>
      </Tabs>
    </div>
  );
};
