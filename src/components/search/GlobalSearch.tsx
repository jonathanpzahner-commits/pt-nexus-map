import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { useSearch } from '@/hooks/useSearch';

export const GlobalSearch = () => {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    clearFilters,
    results,
    isLoading,
    totalResults,
  } = useSearch();

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

      {/* Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        totalResults={totalResults}
      />

      {/* Results */}
      <SearchResults results={results} isLoading={isLoading} />
    </div>
  );
};