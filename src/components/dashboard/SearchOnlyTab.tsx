import React from 'react';
import { StreamlinedSearch } from '../search/StreamlinedSearch';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { getAdsForPage } from '@/data/sponsoredAds';

interface SearchOnlyTabProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export const SearchOnlyTab = ({ title, description, icon: Icon }: SearchOnlyTabProps) => {
  // Determine entity types based on title
  const getEntityTypesFromTitle = (title: string): string[] => {
    if (title.includes('Physical Therapists')) return ['providers'];
    if (title.includes('Companies')) return ['companies', 'consultant_companies', 'equipment_companies'];
    if (title.includes('Education')) return ['schools'];
    if (title.includes('Job')) return ['job_listings'];
    return ['companies', 'schools', 'providers', 'job_listings'];
  };

  // Get page key for ads
  const getPageKeyFromTitle = (title: string): string => {
    if (title.includes('Physical Therapists')) return 'providers';
    if (title.includes('Companies')) return 'companies';
    if (title.includes('Education')) return 'education';
    if (title.includes('Job')) return 'jobs';
    return 'overview';
  };

  const entityTypes = getEntityTypesFromTitle(title);
  const pageKey = getPageKeyFromTitle(title);

  return (
    <div className="space-y-6">
      {/* Sponsored Ads */}
      <SponsoredBanner ads={getAdsForPage(pageKey)} position="top" />
      {/* Clean Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <Icon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Streamlined Search */}
      <StreamlinedSearch contextTypes={entityTypes} />
    </div>
  );
};