import { useState, useMemo } from 'react';
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
  data: any; // Full entity data
}

const defaultFilters: SearchFilters = {
  entityTypes: ['companies', 'schools', 'providers', 'job_listings'],
  location: '',
  specialization: '',
  companyType: '',
  employmentType: '',
  experienceLevel: '',
};

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  // Fetch all data
  const { data: companies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(100000); // Handle large company datasets
      if (error) throw error;
      return data;
    },
  });

  const { data: schools = [], isLoading: loadingSchools } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .limit(10000); // Increased limit for schools
      if (error) throw error;
      return data;
    },
  });

  const { data: providers = [], isLoading: loadingProviders } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .limit(500000); // Handle up to 400k+ physical therapists
      if (error) throw error;
      return data;
    },
  });

  const { data: jobListings = [], isLoading: loadingJobs } = useQuery({
    queryKey: ['job-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .limit(50000); // Increased limit for job listings
      if (error) throw error;
      return data;
    },
  });

  const isLoading = loadingCompanies || loadingSchools || loadingProviders || loadingJobs;

  // Transform data to search results
  const searchResults = useMemo(() => {
    const results: SearchResult[] = [];

    // Add companies
    if (filters.entityTypes.includes('companies')) {
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
    }

    // Add schools
    if (filters.entityTypes.includes('schools')) {
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
    }

    // Add providers
    if (filters.entityTypes.includes('providers')) {
      providers.forEach(provider => {
        const location = provider.city && provider.state ? `${provider.city}, ${provider.state}` : '';
        results.push({
          id: provider.id,
          type: 'provider',
          title: provider.name,
          subtitle: 'Physical Therapist',
          location,
          description: provider.bio,
          data: provider,
        });
      });
    }

    // Add job listings
    if (filters.entityTypes.includes('job_listings')) {
      jobListings.forEach(job => {
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
    }

    return results;
  }, [companies, schools, providers, jobListings, filters.entityTypes]);

  // Filter and search results
  const filteredResults = useMemo(() => {
    let filtered = searchResults;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(result => 
        result.title.toLowerCase().includes(query) ||
        result.subtitle.toLowerCase().includes(query) ||
        result.location.toLowerCase().includes(query) ||
        result.description?.toLowerCase().includes(query) ||
        // Search in specializations for providers
        (result.type === 'provider' && result.data.specializations?.some((spec: string) => 
          spec.toLowerCase().includes(query)
        )) ||
        // Search in services for companies
        (result.type === 'company' && result.data.services?.some((service: string) => 
          service.toLowerCase().includes(query)
        )) ||
        // Search in programs for schools
        (result.type === 'school' && result.data.programs_offered?.some((program: string) => 
          program.toLowerCase().includes(query)
        ))
      );
    }

    // Location filter
    if (filters.location.trim()) {
      const locationQuery = filters.location.toLowerCase();
      filtered = filtered.filter(result => 
        result.location.toLowerCase().includes(locationQuery)
      );
    }

    // Specialization filter (for providers)
    if (filters.specialization.trim()) {
      const specQuery = filters.specialization.toLowerCase();
      filtered = filtered.filter(result => {
        if (result.type === 'provider') {
          return result.data.specializations?.some((spec: string) => 
            spec.toLowerCase().includes(specQuery)
          );
        }
        if (result.type === 'school') {
          return result.data.programs_offered?.some((program: string) => 
            program.toLowerCase().includes(specQuery)
          );
        }
        return true;
      });
    }

    // Company type filter
    if (filters.companyType.trim()) {
      const typeQuery = filters.companyType.toLowerCase();
      filtered = filtered.filter(result => {
        if (result.type === 'company') {
          return result.data.company_type?.toLowerCase().includes(typeQuery);
        }
        return true;
      });
    }

    // Employment type filter (for jobs)
    if (filters.employmentType.trim()) {
      const empQuery = filters.employmentType.toLowerCase();
      filtered = filtered.filter(result => {
        if (result.type === 'job_listing') {
          return result.data.employment_type?.toLowerCase().includes(empQuery);
        }
        return true;
      });
    }

    // Experience level filter (for jobs)
    if (filters.experienceLevel.trim()) {
      const expQuery = filters.experienceLevel.toLowerCase();
      filtered = filtered.filter(result => {
        if (result.type === 'job_listing') {
          return result.data.experience_level?.toLowerCase().includes(expQuery);
        }
        return true;
      });
    }

    return filtered;
  }, [searchResults, searchQuery, filters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    clearFilters,
    results: filteredResults,
    isLoading,
    totalResults: filteredResults.length,
  };
};