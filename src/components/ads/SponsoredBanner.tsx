import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, MapPin, Building, Briefcase, FlaskConical, FileText } from 'lucide-react';

export type AdType = 'job' | 'company' | 'research' | 'survey' | 'education' | 'technology';

interface SponsoredAd {
  id: string;
  type: AdType;
  title: string;
  description: string;
  company: string;
  location?: string;
  ctaText: string;
  ctaUrl: string;
  featured?: boolean;
  rating?: number;
  salary?: string;
  deadline?: string;
}

interface SponsoredBannerProps {
  ads: SponsoredAd[];
  position?: 'top' | 'bottom' | 'sidebar';
  maxAds?: number;
}

const getAdIcon = (type: AdType) => {
  switch (type) {
    case 'job':
      return Briefcase;
    case 'company':
      return Building;
    case 'research':
      return FlaskConical;
    case 'survey':
      return FileText;
    case 'education':
      return Star;
    case 'technology':
      return ExternalLink;
    default:
      return ExternalLink;
  }
};

const getAdTypeLabel = (type: AdType) => {
  switch (type) {
    case 'job':
      return 'Job Opening';
    case 'company':
      return 'Featured Company';
    case 'research':
      return 'Research Study';
    case 'survey':
      return 'Survey Opportunity';
    case 'education':
      return 'Education Program';
    case 'technology':
      return 'Technology Solution';
    default:
      return 'Sponsored';
  }
};

export const SponsoredBanner: React.FC<SponsoredBannerProps> = ({ 
  ads, 
  position = 'top', 
  maxAds = 3 
}) => {
  const displayAds = ads.slice(0, maxAds);

  if (displayAds.length === 0) return null;

  const isSidebar = position === 'sidebar';
  const gridCols = isSidebar ? 'grid-cols-1' : `grid-cols-1 md:grid-cols-${Math.min(displayAds.length, 3)}`;

  return (
    <div className={`w-full ${position === 'bottom' ? 'mt-8' : 'mb-6'}`}>
      {/* Sponsored Content Label */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="text-xs text-muted-foreground border-dashed">
          Sponsored Content
        </Badge>
        <div className="h-px bg-border flex-1" />
      </div>

      {/* Ads Grid */}
      <div className={`grid gap-4 ${gridCols}`}>
        {displayAds.map((ad) => {
          const IconComponent = getAdIcon(ad.type);
          
          return (
            <Card 
              key={ad.id} 
              className={`relative overflow-hidden border-2 transition-all hover:shadow-md ${
                ad.featured 
                  ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10' 
                  : 'border-border/50 hover:border-primary/20'
              }`}
            >
              {ad.featured && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-md">
                  Featured
                </div>
              )}
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Ad Type Badge */}
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {getAdTypeLabel(ad.type)}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                      {ad.title}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {ad.description}
                    </p>

                    {/* Meta Information */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-primary">
                        {ad.company}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {ad.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{ad.location}</span>
                          </div>
                        )}
                        
                        {ad.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{ad.rating}</span>
                          </div>
                        )}
                        
                        {ad.salary && (
                          <div className="font-medium text-green-600">
                            {ad.salary}
                          </div>
                        )}
                      </div>

                      {ad.deadline && (
                        <div className="text-xs text-orange-600">
                          Deadline: {ad.deadline}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    size="sm" 
                    className="w-full text-xs h-8"
                    onClick={() => window.open(ad.ctaUrl, '_blank')}
                  >
                    {ad.ctaText}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Bottom border */}
      <div className="mt-3 h-px bg-border" />
    </div>
  );
};