import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, MapPin, Download, Bookmark, ChevronLeft, ChevronRight, BarChart } from 'lucide-react';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { LocationRadiusSearch } from './LocationRadiusSearch';
import { GeocodingManager } from './GeocodingManager';
import { NPIBackgroundProcessor } from '../admin/NPIBackgroundProcessor';
import { useServerSearch } from '@/hooks/useServerSearch';
import { useState } from 'react';

interface GlobalSearchProps {
  contextTypes?: string[];
}

export const GlobalSearch = ({ contextTypes }: GlobalSearchProps) => {
  const [currentLocationName, setCurrentLocationName] = useState<string>('');
  
  const {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    clearFilters,
    results,
    isLoading,
    totalResults,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  } = useServerSearch(contextTypes as any);

  const handleLocationSet = (latitude: number, longitude: number, address: string) => {
    updateFilters({
      userLatitude: latitude,
      userLongitude: longitude,
    });
    setCurrentLocationName(address);
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Search Header - Only show for global search */}
      {!contextTypes && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-8 border border-primary/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Intelligent PT Ecosystem Search
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover connections across {totalResults.toLocaleString()}+ providers, companies, schools, and opportunities
              </p>
            </div>
            
            {/* Main Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search therapists, companies, schools, jobs, specializations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-14 text-base bg-white/80 backdrop-blur-sm border-primary/20 focus:border-primary shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {['Orthopedic Specialists', 'Sports Medicine', 'Pediatric PT', 'Travel Positions', 'DPT Programs'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-3 py-1 bg-white/60 hover:bg-white/80 text-foreground rounded-full text-sm border border-primary/20 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Focused Search Bar for context-specific searches */}
      {contextTypes && (
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-12 text-base border-border/50 focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* Admin Tools - Only show for global search */}
      {!contextTypes && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NPIBackgroundProcessor />
          <GeocodingManager />
        </div>
      )}

      {/* Advanced Search Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location & Radius */}
        <div className="lg:col-span-1">
          <LocationRadiusSearch
            onLocationSet={handleLocationSet}
            radius={filters.radius}
            onRadiusChange={(radius) => updateFilters({ radius })}
            currentLocation={currentLocationName}
          />
        </div>

        {/* Filters */}
        <div className="lg:col-span-2">
          <SearchFilters
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
            totalResults={totalResults}
            contextTypes={contextTypes}
          />
        </div>
      </div>

      {/* Search Results Summary */}
      {totalResults > 0 && (
        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {totalResults.toLocaleString()} results
              {searchQuery && (
                <span> for <span className="font-medium text-foreground">"{searchQuery}"</span></span>
              )}
            </div>
            {currentLocationName && (
              <div className="text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 inline mr-1" />
                Near {currentLocationName}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Bookmark className="h-4 w-4 mr-2" />
              Save Search
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      <SearchResults results={results as any} isLoading={isLoading} />

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            onClick={prevPage}
            disabled={!hasPrevPage}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i;
              if (pageNum > totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-10 h-10"
                  onClick={() => {/* navigate to page */}}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            onClick={nextPage}
            disabled={!hasNextPage}
            variant="outline"
            size="sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Search Analytics for Investors */}
      {totalResults > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-600" />
              Search Intelligence
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{results.filter(r => r.type === 'provider').length}</div>
                <div className="text-xs text-muted-foreground">Providers Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.filter(r => r.type === 'company').length}</div>
                <div className="text-xs text-muted-foreground">Companies Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{results.filter(r => r.type === 'school').length}</div>
                <div className="text-xs text-muted-foreground">Schools Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{results.filter(r => r.type === 'job_listing').length}</div>
                <div className="text-xs text-muted-foreground">Jobs Found</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};