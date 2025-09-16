import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

import { SearchFilters, SearchResult } from '@/types/search';

const createDefaultFilters = (preselectedTypes?: SearchFilters['entityTypes']): SearchFilters => ({
  entityTypes: preselectedTypes || ['companies', 'schools', 'job_listings', 'consultant_companies', 'equipment_companies', 'pe_firms', 'profiles', 'providers'],
  location: '',
  specialization: '',
  companyType: '',
  employmentType: '',
  experienceLevel: '',
  radius: 50, // 50 miles default
  userLatitude: undefined,
  userLongitude: undefined,
  primarySetting: '',
  subSetting: '',
  specialty: '',
  certification: '',
  consultantCategory: '',
  consultantSpecialty: '',
  costCategory: '',
  programLength: '',
  programType: '',
  accreditation: '',
});

const RESULTS_PER_PAGE = 50;

export const useServerSearch = (preselectedTypes?: SearchFilters['entityTypes']) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(() => createDefaultFilters(preselectedTypes));
  const [currentPage, setCurrentPage] = useState(1);

  console.log('useServerSearch - Current filters:', filters);
  console.log('useServerSearch - Search query:', searchQuery);
  console.log('useServerSearch - Entity types:', filters.entityTypes);
  
  const isQueryEnabled = (searchQuery.trim().length > 2) || Boolean(
    filters.location ||
    filters.specialization ||
    filters.companyType ||
    filters.employmentType ||
    filters.experienceLevel ||
    filters.primarySetting ||
    filters.subSetting ||
    filters.specialty ||
    filters.certification ||
    filters.consultantCategory ||
    filters.consultantSpecialty ||
    filters.costCategory ||
    filters.programLength ||
    filters.programType ||
    filters.accreditation
  ) || Boolean(
    // Auto-load non-provider entity types
    filters.entityTypes.some(type => 
      ['companies', 'schools', 'job_listings', 'consultant_companies', 'equipment_companies', 'pe_firms', 'profiles'].includes(type)
    )
  );
  
  console.log('Query enabled:', isQueryEnabled);

  // Server-side search with pagination
  const { data: searchData, isLoading } = useQuery({
    queryKey: ['server-search', searchQuery, filters, currentPage],
    queryFn: async () => {
      console.log('=== SERVER SEARCH STARTING ===');
      console.log('Search query:', searchQuery);
      console.log('Filters:', filters);
      console.log('Current page:', currentPage);
      
      const results: SearchResult[] = [];
      let totalCount = 0;

      const offset = (currentPage - 1) * RESULTS_PER_PAGE;

      // Search providers - only when there's a search query or provider-specific filters
      if (filters.entityTypes.includes('providers') && (
        searchQuery.trim().length > 2 || 
        filters.specialization ||
        filters.primarySetting ||
        filters.subSetting ||
        filters.specialty ||
        filters.certification ||
        filters.location
      )) {
        let query = supabase
          .from('providers')
          .select('*', { count: 'exact' })
          .range(offset, offset + RESULTS_PER_PAGE - 1);

        // Apply text search across ALL provider fields
        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase();
          query = query.or(`name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%,license_number.ilike.%${searchTerm}%,license_state.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%,current_employer.ilike.%${searchTerm}%,current_job_title.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,additional_info.ilike.%${searchTerm}%,source.ilike.%${searchTerm}%,specializations.cs.{${searchTerm}}`);
        }

        // Use radius search if coordinates are available
        if (filters.userLatitude && filters.userLongitude && filters.radius) {
          try {
            let radiusQuery = supabase
              .rpc('providers_within_radius', {
                user_lat: filters.userLatitude,
                user_lng: filters.userLongitude,
                radius_miles: filters.radius
              })
              .range(offset, offset + RESULTS_PER_PAGE - 1);

            // Apply text search to radius results if needed
            if (searchQuery.trim()) {
              const searchTerm = searchQuery.toLowerCase();
              radiusQuery = radiusQuery.or(`name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%,license_number.ilike.%${searchTerm}%,license_state.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%,current_employer.ilike.%${searchTerm}%,current_job_title.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,additional_info.ilike.%${searchTerm}%,source.ilike.%${searchTerm}%,specializations.cs.{${searchTerm}}`);
            }

            // Apply specialization filter (legacy)
            if (filters.specialization.trim()) {
              radiusQuery = radiusQuery.contains('specializations', [filters.specialization]);
            }

            // Apply new provider filters
            if (filters.specialty?.trim()) {
              radiusQuery = radiusQuery.contains('specializations', [filters.specialty]);
            }

            const { data: radiusResults, error: radiusError } = await radiusQuery;
            
            if (!radiusError && radiusResults) {
              let validProviderCount = 0;
              radiusResults.forEach((provider: any) => {
                // Skip generic NPI providers with placeholder names
                if (provider.name?.match(/^Provider \d+-\d+$/)) {
                  return;
                }
                
                const location = provider.city && provider.state ? `${provider.city}, ${provider.state}` : '';
                const displayName = provider.name || `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || 'Unknown Provider';
                
                results.push({
                  id: provider.id,
                  type: 'provider',
                  title: displayName,
                  subtitle: `Physical Therapist (${provider.distance_miles?.toFixed(1)}mi away)`,
                  location,
                  description: provider.bio,
                  data: provider,
                });
                validProviderCount++;
              });
              totalCount += validProviderCount; // Only count providers actually added to results
            } else {
              console.warn('Radius search failed, falling back to regular search:', radiusError);
              // Fall back to regular search
              await executeRegularProviderSearch();
            }
          } catch (radiusError) {
            console.warn('Radius search error, falling back to regular search:', radiusError);
            // Fall back to regular search
            await executeRegularProviderSearch();
          }
        } else {
          // Regular provider search when no location coordinates
          await executeRegularProviderSearch();
        }

        // Helper function for regular provider search
        async function executeRegularProviderSearch() {
          if (filters.location.trim()) {
            const locationTerm = filters.location.toLowerCase();
            query = query.or(`city.ilike.%${locationTerm}%,state.ilike.%${locationTerm}%,zip_code.ilike.%${locationTerm}%`);
          }

          // Apply specialization filter (legacy)
          if (filters.specialization.trim()) {
            query = query.contains('specializations', [filters.specialization]);
          }

          // Apply new provider filters  
          if (filters.specialty?.trim()) {
            query = query.contains('specializations', [filters.specialty]);
          }

          const { data: providers, error, count } = await query;
          if (error) throw error;

          if (providers) {
            let validProviderCount = 0;
            providers.forEach(provider => {
              // Skip generic NPI providers with placeholder names
              if (provider.name?.match(/^Provider \d+-\d+$/)) {
                return;
              }
              
              const location = provider.city && provider.state ? `${provider.city}, ${provider.state}` : '';
              const displayName = provider.name || `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || 'Unknown Provider';
              
              results.push({
                id: provider.id,
                type: 'provider',
                title: displayName,
                subtitle: 'Physical Therapist',
                location,
                description: provider.bio,
                data: provider,
              });
              validProviderCount++;
            });
            // Adjust count to reflect only valid providers that were actually added
            const actualCount = count ? Math.min(validProviderCount, count) : validProviderCount;
            totalCount += actualCount;
          }
        }
      }

      // Search companies
      if (filters.entityTypes.includes('companies') && currentPage === 1) {
        console.log('=== SEARCHING COMPANIES ===');
        let query = supabase
          .from('companies')
          .select('*', { count: 'exact' })
          .limit(RESULTS_PER_PAGE);

        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase();
          query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,company_type.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%,services.cs.{${searchTerm}},company_locations.cs.{${searchTerm}}`);
        }

        if (filters.companyType.trim()) {
          query = query.ilike('company_type', `%${filters.companyType}%`);
        }

        const { data: companies, error, count } = await query;
        console.log('Companies query result:', { data: companies?.length, error, count });
        if (error) {
          console.error('Companies query error:', error);
          throw error;
        }

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
          query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%,accreditation.ilike.%${searchTerm}%,programs_offered.cs.{${searchTerm}},specializations.cs.{${searchTerm}}`);
        }

        if (filters.location.trim()) {
          const locationTerm = filters.location.toLowerCase();
          query = query.or(`city.ilike.%${locationTerm}%,state.ilike.%${locationTerm}%,zip_code.ilike.%${locationTerm}%`);
        }

        // Apply school-specific filters
        if (filters.accreditation?.trim()) {
          query = query.ilike('accreditation', `%${filters.accreditation}%`);
        }
        if (filters.programType?.trim()) {
          query = query.contains('programs_offered', [filters.programType]);
        }
        if (filters.programLength?.trim()) {
          switch (filters.programLength) {
            case 'Less than 1 year':
              query = query.lt('program_length_months', 12);
              break;
            case '1-2 years':
              query = query.gte('program_length_months', 12).lte('program_length_months', 24);
              break;
            case '2-3 years':
              query = query.gte('program_length_months', 24).lte('program_length_months', 36);
              break;
            case '3-4 years':
              query = query.gte('program_length_months', 36).lte('program_length_months', 48);
              break;
            case 'More than 4 years':
              query = query.gt('program_length_months', 48);
              break;
          }
        }
        if (filters.costCategory?.trim()) {
          switch (filters.costCategory) {
            case 'Under $10,000':
              query = query.lte('tuition_per_year', 10000);
              break;
            case '$10,000 - $25,000':
              query = query.gte('tuition_per_year', 10000).lte('tuition_per_year', 25000);
              break;
            case '$25,000 - $50,000':
              query = query.gte('tuition_per_year', 25000).lte('tuition_per_year', 50000);
              break;
            case '$50,000 - $100,000':
              query = query.gte('tuition_per_year', 50000).lte('tuition_per_year', 100000);
              break;
            case 'Over $100,000':
              query = query.gt('tuition_per_year', 100000);
              break;
          }
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
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,requirements.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%,employment_type.ilike.%${searchTerm}%,experience_level.ilike.%${searchTerm}%`);
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

      // Search consultant companies
      if (filters.entityTypes.includes('consultant_companies') && currentPage === 1) {
        let query = supabase
          .from('consultant_companies')
          .select('*', { count: 'exact' })
          .limit(RESULTS_PER_PAGE);

        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase();
          query = query.or(`name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%,linkedin_url.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%,consulting_categories.cs.{${searchTerm}},industries.cs.{${searchTerm}},territories.cs.{${searchTerm}},certifications.cs.{${searchTerm}}`);
        }

        if (filters.location.trim()) {
          const locationTerm = filters.location.toLowerCase();
          query = query.or(`city.ilike.%${locationTerm}%,state.ilike.%${locationTerm}%`);
        }

        // Apply new consultant filters
        if (filters.consultantCategory?.trim()) {
          query = query.contains('consulting_categories', [filters.consultantCategory]);
        }

        const { data: consultants, error, count } = await query;
        if (error) throw error;

        if (consultants) {
          consultants.forEach(consultant => {
            const location = consultant.city && consultant.state ? `${consultant.city}, ${consultant.state}` : '';
            const title = consultant.name || `${consultant.first_name} ${consultant.last_name}`;
            results.push({
              id: consultant.id,
              type: 'consultant_company',
              title,
              subtitle: consultant.company || 'Healthcare Consultant',
              location,
              description: consultant.bio,
              data: consultant,
            });
          });
          totalCount += count || 0;
        }
      }

      // Search equipment companies
      if (filters.entityTypes.includes('equipment_companies') && currentPage === 1) {
        let query = supabase
          .from('equipment_companies')
          .select('*', { count: 'exact' })
          .limit(RESULTS_PER_PAGE);

        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase();
          query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,company_type.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%,linkedin_url.ilike.%${searchTerm}%,equipment_categories.cs.{${searchTerm}},product_lines.cs.{${searchTerm}},target_markets.cs.{${searchTerm}},certifications.cs.{${searchTerm}}`);
        }

        if (filters.location.trim()) {
          const locationTerm = filters.location.toLowerCase();
          query = query.or(`city.ilike.%${locationTerm}%,state.ilike.%${locationTerm}%`);
        }

        const { data: equipment, error, count } = await query;
        if (error) throw error;

        if (equipment) {
          equipment.forEach(company => {
            const location = company.city && company.state ? `${company.city}, ${company.state}` : '';
            results.push({
              id: company.id,
              type: 'equipment_company',
              title: company.name,
              subtitle: company.company_type || 'Equipment Company',
              location,
              description: company.description,
              data: company,
            });
          });
          totalCount += count || 0;
        }
      }

      // Search PE firms
      if (filters.entityTypes.includes('pe_firms') && currentPage === 1) {
        let query = supabase
          .from('pe_firms')
          .select('*', { count: 'exact' })
          .limit(RESULTS_PER_PAGE);

        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase();
          query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,firm_type.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%,linkedin_url.ilike.%${searchTerm}%,investment_stage.cs.{${searchTerm}},geographic_focus.cs.{${searchTerm}},sector_focus.cs.{${searchTerm}},portfolio_companies.cs.{${searchTerm}}`);
        }

        if (filters.location.trim()) {
          const locationTerm = filters.location.toLowerCase();
          query = query.or(`city.ilike.%${locationTerm}%,state.ilike.%${locationTerm}%`);
        }

        const { data: firms, error, count } = await query;
        if (error) throw error;

        if (firms) {
          firms.forEach(firm => {
            const location = firm.city && firm.state ? `${firm.city}, ${firm.state}` : '';
            results.push({
              id: firm.id,
              type: 'pe_firm',
              title: firm.name,
              subtitle: firm.firm_type || 'Private Equity',
              location,
              description: firm.description,
              data: firm,
            });
          });
          totalCount += count || 0;
        }
      }

      // Search public profiles
      if (filters.entityTypes.includes('profiles') && currentPage === 1) {
        let query = supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .eq('is_public', true)
          .limit(RESULTS_PER_PAGE);

        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase();
          query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,current_employer.ilike.%${searchTerm}%,current_position.ilike.%${searchTerm}%,about_me.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%,linkedin_url.ilike.%${searchTerm}%,interests.cs.{${searchTerm}},research_interests.cs.{${searchTerm}},certifications.cs.{${searchTerm}},education.cs.{${searchTerm}},sme_areas.cs.{${searchTerm}},specializations.cs.{${searchTerm}}`);
        }

        if (filters.location.trim()) {
          const locationTerm = filters.location.toLowerCase();
          query = query.or(`city.ilike.%${locationTerm}%,state.ilike.%${locationTerm}%,location.ilike.%${locationTerm}%`);
        }

        const { data: profiles, error, count } = await query;
        if (error) throw error;

        if (profiles) {
          profiles.forEach(profile => {
            const location = profile.city && profile.state ? `${profile.city}, ${profile.state}` : profile.location || '';
            const title = `${profile.first_name} ${profile.last_name}`;
            results.push({
              id: profile.id,
              type: 'profile',
              title,
              subtitle: profile.current_position || 'Professional',
              location,
              description: profile.about_me,
              data: profile,
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
    enabled: isQueryEnabled,
  });

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(createDefaultFilters(preselectedTypes));
    setSearchQuery('');
    setCurrentPage(1);
  }, [preselectedTypes]);

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