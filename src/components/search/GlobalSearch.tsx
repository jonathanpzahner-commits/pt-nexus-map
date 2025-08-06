import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { LocationRadiusSearch } from './LocationRadiusSearch';
import { GeocodingManager } from './GeocodingManager';
import { useServerSearch } from '@/hooks/useServerSearch';
import { useState } from 'react';

export const GlobalSearch = () => {
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
  } = useServerSearch();

  const handleLocationSet = (latitude: number, longitude: number, address: string) => {
    updateFilters({
      userLatitude: latitude,
      userLongitude: longitude,
    });
    setCurrentLocationName(address);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search across companies, schools, providers, and jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Geocoding Setup */}
      <GeocodingManager />

      {/* Location & Radius Search */}
      <LocationRadiusSearch
        onLocationSet={handleLocationSet}
        radius={filters.radius}
        onRadiusChange={(radius) => updateFilters({ radius })}
        currentLocation={currentLocationName}
      />

      {/* Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        totalResults={totalResults}
      />

      {/* Results */}
      <SearchResults results={results} isLoading={isLoading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={prevPage}
            disabled={!hasPrevPage}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={!hasNextPage}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};