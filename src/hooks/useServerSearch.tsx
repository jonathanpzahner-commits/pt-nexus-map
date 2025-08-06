import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchFilters {
  entityTypes: ('companies' | 'schools' | 'providers' | 'job_listings')[];
  location: string;
  specialization: string;
  companyType: string;
  employmentType: string;
  experienceLevel: string;
}

export interface SearchResult {
  id: string;
  type: 'company' | 'school' | 'provider' | 'job_listing';
  title: string;
  subtitle: string;
  location: string;
  description?: string;
  data: any;
}

const defaultFilters: SearchFilters = {
  entityTypes: ['companies', 'schools', 'providers', 'job_listings'],
  location: '',
  specialization: '',
  companyType: '',
  employmentType: '',
  experienceLevel: '',
};

const RESULTS_PER_PAGE = 50;

export const useServerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // Server-side search with pagination
  const { data: searchData, isLoading } = useQuery({
    queryKey: ['server-search', searchQuery, filters, currentPage],
    queryFn: async () => {
      const results: SearchResult[] = [];
      let totalCount = 0;

      const offset = (currentPage - 1) * RESULTS_PER_PAGE;

      // Search providers
      if (filters.entityTypes.includes('providers')) {
        let query = supabase
          .from('providers')
          .select('*', { count: 'exact' })
          .range(offset, offset + RESULTS_PER_PAGE - 1);

        // Apply text search
        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase();
          query = query.or(`name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,specializations.cs.{${searchTerm}}`);
        }

        // Apply location filter
        if (filters.location.trim()) {
          const locationTerm = filters.location.toLowerCase();
          query = query.or(`city.ilike.%${locationTerm}%,state.ilike.%${locationTerm}%`);
        }

        // Apply specialization filter
        if (filters.specialization.trim()) {
          query = query.contains('specializations', [filters.specialization]);
        }

        const { data: providers, error, count } = await query;
        if (error) throw error;

        if (providers) {
          providers.forEach(provider => {
            const location = provider.city && provider.state ? `${provider.city}, ${provider.state}` : '';
            results.push({
              id: provider.id,
              type: 'provider',
              title: provider.name || `${provider.first_name} ${provider.last_name}`,
              subtitle: 'Physical Therapist',
              location,
              description: provider.bio,
              data: provider,
            });
          });
          totalCount += count || 0;
        }
      }

      // Search companies
      if (filters.entityTypes.includes('companies') && currentPage === 1) {
        let query = supabase
          .from('companies')
          .select('*', { count: 'exact' })
          .limit(RESULTS_PER_PAGE);

        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase();
          query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,company_type.ilike.%${searchTerm}%`);
        }

        if (filters.companyType.trim()) {
          query = query.ilike('company_type', `%${filters.companyType}%`);
        }

        const { data: companies, error, count } = await query;
        if (error) throw error;

        if (companies) {
          companies.forEach(company => {
            const location = company.company_locations?.join(', ') || '';
            results.push({
              id: company.id,
              type: 'company',
              title: company.name,
              subtitle: company.company_type,
              location,
              description: company.description,
              data: company,
            });
          });
          totalCount += count || 0;
        }
      }

      // Search schools
      if (filters.entityTypes.includes('schools') && currentPage === 1) {
        let query = supabase
          .from('schools')
          .select('*', { count: 'exact' })
          .limit(RESULTS_PER_PAGE);

        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase();
          query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%`);
        }

        if (filters.location.trim()) {
          const locationTerm = filters.location.toLowerCase();
          query = query.or(`city.ilike.%${locationTerm}%,state.ilike.%${locationTerm}%`);
        }

        const { data: schools, error, count } = await query;
        if (error) throw error;

        if (schools) {
          schools.forEach(school => {
            const location = `${school.city}, ${school.state}`;
            results.push({
              id: school.id,
              type: 'school',
              title: school.name,
              subtitle: 'Educational Institution',
              location,
              description: school.description,
              data: school,
            });
          });
          totalCount += count || 0;
        }
      }

      // Search job listings
      if (filters.entityTypes.includes('job_listings') && currentPage === 1) {
        let query = supabase
          .from('job_listings')
          .select('*', { count: 'exact' })
          .limit(RESULTS_PER_PAGE);

        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase();
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%`);
        }

        if (filters.employmentType.trim()) {
          query = query.ilike('employment_type', `%${filters.employmentType}%`);
        }

        if (filters.experienceLevel.trim()) {
          query = query.ilike('experience_level', `%${filters.experienceLevel}%`);
        }

        const { data: jobs, error, count } = await query;
        if (error) throw error;

        if (jobs) {
          jobs.forEach(job => {
            const location = `${job.city}, ${job.state}`;
            results.push({
              id: job.id,
              type: 'job_listing',
              title: job.title,
              subtitle: job.employment_type || 'Job Opening',
              location,
              description: job.description,
              data: job,
            });
          });
          totalCount += count || 0;
        }
      }

      return {
        results,
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / RESULTS_PER_PAGE),
      };
    },
    enabled: true,
  });

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    if (searchData && currentPage < searchData.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, searchData]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  return {
    searchQuery,
    setSearchQuery: useCallback((query: string) => {
      setSearchQuery(query);
      setCurrentPage(1); // Reset to first page on new search
    }, []),
    filters,
    updateFilters,
    clearFilters,
    results: searchData?.results || [],
    isLoading,
    totalResults: searchData?.totalCount || 0,
    currentPage,
    totalPages: searchData?.totalPages || 1,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: searchData ? currentPage < searchData.totalPages : false,
    hasPrevPage: currentPage > 1,
  };
};