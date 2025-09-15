// Shared types for search to avoid circular imports and heavy type inference

export type EntityType =
  | 'companies'
  | 'schools'
  | 'providers'
  | 'job_listings'
  | 'consultant_companies'
  | 'equipment_companies'
  | 'pe_firms'
  | 'profiles';

export interface SearchFilters {
  entityTypes: EntityType[];
  location: string;
  specialization: string;
  companyType: string;
  employmentType: string;
  experienceLevel: string;
  radius: number; // in miles
  userLatitude?: number;
  userLongitude?: number;
  // Provider-specific filters
  primarySetting?: string;
  subSetting?: string;
  specialty?: string;
  certification?: string;
  // Consultant-specific filters
  consultantCategory?: string;
  consultantSpecialty?: string;
}

export type SearchResultType =
  | 'company'
  | 'school'
  | 'provider'
  | 'job_listing'
  | 'consultant_company'
  | 'equipment_company'
  | 'pe_firm'
  | 'profile';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  location: string;
  description?: string;
  data: any;
}
