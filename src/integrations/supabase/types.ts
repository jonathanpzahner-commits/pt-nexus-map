export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bulk_upload_jobs: {
        Row: {
          created_at: string
          entity_type: string
          error_details: Json | null
          failed_rows: number | null
          file_name: string
          file_path: string
          id: string
          processed_rows: number | null
          results: Json | null
          status: string
          successful_rows: number | null
          total_rows: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_type: string
          error_details?: Json | null
          failed_rows?: number | null
          file_name: string
          file_path: string
          id?: string
          processed_rows?: number | null
          results?: Json | null
          status?: string
          successful_rows?: number | null
          total_rows?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_type?: string
          error_details?: Json | null
          failed_rows?: number | null
          file_name?: string
          file_path?: string
          id?: string
          processed_rows?: number | null
          results?: Json | null
          status?: string
          successful_rows?: number | null
          total_rows?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          company_locations: string[] | null
          company_size_range: string | null
          company_type: string
          created_at: string
          description: string | null
          founded_year: number | null
          glassdoor_rating: number | null
          glassdoor_url: string | null
          id: string
          latitude: number | null
          leadership: Json | null
          longitude: number | null
          name: string
          number_of_clinics: number | null
          parent_company: string | null
          pe_backed: boolean | null
          pe_firm_name: string | null
          pe_relationship_start_date: string | null
          services: string[] | null
          state: string | null
          updated_at: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_locations?: string[] | null
          company_size_range?: string | null
          company_type: string
          created_at?: string
          description?: string | null
          founded_year?: number | null
          glassdoor_rating?: number | null
          glassdoor_url?: string | null
          id?: string
          latitude?: number | null
          leadership?: Json | null
          longitude?: number | null
          name: string
          number_of_clinics?: number | null
          parent_company?: string | null
          pe_backed?: boolean | null
          pe_firm_name?: string | null
          pe_relationship_start_date?: string | null
          services?: string[] | null
          state?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_locations?: string[] | null
          company_size_range?: string | null
          company_type?: string
          created_at?: string
          description?: string | null
          founded_year?: number | null
          glassdoor_rating?: number | null
          glassdoor_url?: string | null
          id?: string
          latitude?: number | null
          leadership?: Json | null
          longitude?: number | null
          name?: string
          number_of_clinics?: number | null
          parent_company?: string | null
          pe_backed?: boolean | null
          pe_firm_name?: string | null
          pe_relationship_start_date?: string | null
          services?: string[] | null
          state?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      consultant_companies: {
        Row: {
          bio: string | null
          certifications: string[] | null
          city: string | null
          company: string | null
          consulting_categories: string[] | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          industries: string[] | null
          last_name: string | null
          latitude: number | null
          linkedin_url: string | null
          longitude: number | null
          name: string | null
          phone: string | null
          state: string | null
          territories: string[] | null
          title: string | null
          updated_at: string
          website: string | null
          years_experience: number | null
          zip_code: string | null
        }
        Insert: {
          bio?: string | null
          certifications?: string[] | null
          city?: string | null
          company?: string | null
          consulting_categories?: string[] | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          industries?: string[] | null
          last_name?: string | null
          latitude?: number | null
          linkedin_url?: string | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
          state?: string | null
          territories?: string[] | null
          title?: string | null
          updated_at?: string
          website?: string | null
          years_experience?: number | null
          zip_code?: string | null
        }
        Update: {
          bio?: string | null
          certifications?: string[] | null
          city?: string | null
          company?: string | null
          consulting_categories?: string[] | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          industries?: string[] | null
          last_name?: string | null
          latitude?: number | null
          linkedin_url?: string | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
          state?: string | null
          territories?: string[] | null
          title?: string | null
          updated_at?: string
          website?: string | null
          years_experience?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      equipment_companies: {
        Row: {
          address: string | null
          certifications: string[] | null
          city: string | null
          company_type: string
          created_at: string
          description: string | null
          email: string | null
          employee_count: number | null
          equipment_categories: string[] | null
          founded_year: number | null
          id: string
          latitude: number | null
          linkedin_url: string | null
          longitude: number | null
          name: string
          phone: string | null
          product_lines: string[] | null
          state: string | null
          target_markets: string[] | null
          updated_at: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          certifications?: string[] | null
          city?: string | null
          company_type?: string
          created_at?: string
          description?: string | null
          email?: string | null
          employee_count?: number | null
          equipment_categories?: string[] | null
          founded_year?: number | null
          id?: string
          latitude?: number | null
          linkedin_url?: string | null
          longitude?: number | null
          name: string
          phone?: string | null
          product_lines?: string[] | null
          state?: string | null
          target_markets?: string[] | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          certifications?: string[] | null
          city?: string | null
          company_type?: string
          created_at?: string
          description?: string | null
          email?: string | null
          employee_count?: number | null
          equipment_categories?: string[] | null
          founded_year?: number | null
          id?: string
          latitude?: number | null
          linkedin_url?: string | null
          longitude?: number | null
          name?: string
          phone?: string | null
          product_lines?: string[] | null
          state?: string | null
          target_markets?: string[] | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      job_listings: {
        Row: {
          city: string
          company_id: string | null
          company_name: string | null
          created_at: string
          description: string | null
          employment_type: string | null
          experience_level: string | null
          external_id: string | null
          external_url: string | null
          id: string
          is_remote: boolean | null
          latitude: number | null
          longitude: number | null
          posted_by: string | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          source: string | null
          state: string
          title: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          city: string
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          experience_level?: string | null
          external_id?: string | null
          external_url?: string | null
          id?: string
          is_remote?: boolean | null
          latitude?: number | null
          longitude?: number | null
          posted_by?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source?: string | null
          state: string
          title: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          city?: string
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          experience_level?: string | null
          external_id?: string | null
          external_url?: string | null
          id?: string
          is_remote?: boolean | null
          latitude?: number | null
          longitude?: number | null
          posted_by?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source?: string | null
          state?: string
          title?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_listings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pe_firms: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          description: string | null
          email: string | null
          firm_type: string
          founded_year: number | null
          geographic_focus: string[] | null
          healthcare_focus: boolean | null
          id: string
          investment_stage: string[] | null
          key_contacts: Json | null
          latitude: number | null
          linkedin_url: string | null
          longitude: number | null
          name: string
          phone: string | null
          portfolio_companies: string[] | null
          sector_focus: string[] | null
          state: string | null
          total_aum: number | null
          typical_deal_size_max: number | null
          typical_deal_size_min: number | null
          updated_at: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          firm_type?: string
          founded_year?: number | null
          geographic_focus?: string[] | null
          healthcare_focus?: boolean | null
          id?: string
          investment_stage?: string[] | null
          key_contacts?: Json | null
          latitude?: number | null
          linkedin_url?: string | null
          longitude?: number | null
          name: string
          phone?: string | null
          portfolio_companies?: string[] | null
          sector_focus?: string[] | null
          state?: string | null
          total_aum?: number | null
          typical_deal_size_max?: number | null
          typical_deal_size_min?: number | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          firm_type?: string
          founded_year?: number | null
          geographic_focus?: string[] | null
          healthcare_focus?: boolean | null
          id?: string
          investment_stage?: string[] | null
          key_contacts?: Json | null
          latitude?: number | null
          linkedin_url?: string | null
          longitude?: number | null
          name?: string
          phone?: string | null
          portfolio_companies?: string[] | null
          sector_focus?: string[] | null
          state?: string | null
          total_aum?: number | null
          typical_deal_size_max?: number | null
          typical_deal_size_min?: number | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      processing_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_details: string | null
          id: string
          job_type: string
          metadata: Json | null
          progress_data: Json | null
          result_data: Json | null
          started_at: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_details?: string | null
          id?: string
          job_type: string
          metadata?: Json | null
          progress_data?: Json | null
          result_data?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_details?: string | null
          id?: string
          job_type?: string
          metadata?: Json | null
          progress_data?: Json | null
          result_data?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          about_me: string | null
          available_for_collaboration: boolean | null
          available_for_mentoring: boolean | null
          certifications: string[] | null
          city: string | null
          created_at: string
          current_employer: string | null
          current_position: string | null
          education: string[] | null
          email: string | null
          first_name: string | null
          id: string
          interests: string[] | null
          is_public: boolean | null
          last_name: string | null
          linkedin_url: string | null
          location: string | null
          phone: string | null
          preferred_contact_method: string | null
          profile_photo_url: string | null
          research_interests: string[] | null
          resume_url: string | null
          sme_areas: string[] | null
          specializations: string[] | null
          state: string | null
          updated_at: string
          user_id: string
          website: string | null
          years_experience: number | null
        }
        Insert: {
          about_me?: string | null
          available_for_collaboration?: boolean | null
          available_for_mentoring?: boolean | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string
          current_employer?: string | null
          current_position?: string | null
          education?: string[] | null
          email?: string | null
          first_name?: string | null
          id?: string
          interests?: string[] | null
          is_public?: boolean | null
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          profile_photo_url?: string | null
          research_interests?: string[] | null
          resume_url?: string | null
          sme_areas?: string[] | null
          specializations?: string[] | null
          state?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          years_experience?: number | null
        }
        Update: {
          about_me?: string | null
          available_for_collaboration?: boolean | null
          available_for_mentoring?: boolean | null
          certifications?: string[] | null
          city?: string | null
          created_at?: string
          current_employer?: string | null
          current_position?: string | null
          education?: string[] | null
          email?: string | null
          first_name?: string | null
          id?: string
          interests?: string[] | null
          is_public?: boolean | null
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          profile_photo_url?: string | null
          research_interests?: string[] | null
          resume_url?: string | null
          sme_areas?: string[] | null
          specializations?: string[] | null
          state?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          additional_info: string | null
          bio: string | null
          city: string | null
          created_at: string
          current_employer: string | null
          current_job_title: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          latitude: number | null
          license_number: string | null
          license_state: string | null
          linkedin_url: string | null
          longitude: number | null
          name: string | null
          phone: string | null
          source: string | null
          specializations: string[] | null
          state: string | null
          updated_at: string
          website: string | null
          years_experience: number | null
          zip_code: string | null
        }
        Insert: {
          additional_info?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          current_employer?: string | null
          current_job_title?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          latitude?: number | null
          license_number?: string | null
          license_state?: string | null
          linkedin_url?: string | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
          source?: string | null
          specializations?: string[] | null
          state?: string | null
          updated_at?: string
          website?: string | null
          years_experience?: number | null
          zip_code?: string | null
        }
        Update: {
          additional_info?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          current_employer?: string | null
          current_job_title?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          latitude?: number | null
          license_number?: string | null
          license_state?: string | null
          linkedin_url?: string | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
          source?: string | null
          specializations?: string[] | null
          state?: string | null
          updated_at?: string
          website?: string | null
          years_experience?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          accreditation: string | null
          average_class_size: number | null
          city: string
          created_at: string
          description: string | null
          faculty_count: number | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          program_length_months: number | null
          programs_offered: string[] | null
          specializations: string[] | null
          state: string
          tuition_per_year: number | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          accreditation?: string | null
          average_class_size?: number | null
          city: string
          created_at?: string
          description?: string | null
          faculty_count?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          program_length_months?: number | null
          programs_offered?: string[] | null
          specializations?: string[] | null
          state: string
          tuition_per_year?: number | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          accreditation?: string | null
          average_class_size?: number | null
          city?: string
          created_at?: string
          description?: string | null
          faculty_count?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          program_length_months?: number | null
          programs_offered?: string[] | null
          specializations?: string[] | null
          state?: string
          tuition_per_year?: number | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      survey_analytics: {
        Row: {
          completion_rate: number | null
          created_at: string
          id: string
          page_views: number | null
          respondent_role: string
          source_campaign: string | null
          time_spent_seconds: number | null
        }
        Insert: {
          completion_rate?: number | null
          created_at?: string
          id?: string
          page_views?: number | null
          respondent_role: string
          source_campaign?: string | null
          time_spent_seconds?: number | null
        }
        Update: {
          completion_rate?: number | null
          created_at?: string
          id?: string
          page_views?: number | null
          respondent_role?: string
          source_campaign?: string | null
          time_spent_seconds?: number | null
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          additional_comments: string | null
          beta_interest: boolean | null
          company_name: string | null
          company_size: string | null
          contact_email: string | null
          contact_name: string | null
          created_at: string
          current_challenges: string[] | null
          feature_priorities: Json | null
          id: string
          pain_point_severity: Json | null
          pricing_willingness: string | null
          respondent_role: string
          tools_currently_used: string[] | null
          updated_at: string
          years_experience: string | null
        }
        Insert: {
          additional_comments?: string | null
          beta_interest?: boolean | null
          company_name?: string | null
          company_size?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          current_challenges?: string[] | null
          feature_priorities?: Json | null
          id?: string
          pain_point_severity?: Json | null
          pricing_willingness?: string | null
          respondent_role: string
          tools_currently_used?: string[] | null
          updated_at?: string
          years_experience?: string | null
        }
        Update: {
          additional_comments?: string | null
          beta_interest?: boolean | null
          company_name?: string | null
          company_size?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          current_challenges?: string[] | null
          feature_priorities?: Json | null
          id?: string
          pain_point_severity?: Json | null
          pricing_willingness?: string | null
          respondent_role?: string
          tools_currently_used?: string[] | null
          updated_at?: string
          years_experience?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      companies_within_radius: {
        Args: { radius_miles: number; user_lat: number; user_lng: number }
        Returns: {
          address: string
          city: string
          company_locations: string[]
          company_type: string
          created_at: string
          description: string
          distance_miles: number
          employee_count: number
          founded_year: number
          id: string
          latitude: number
          longitude: number
          name: string
          services: string[]
          state: string
          updated_at: string
          website: string
          zip_code: string
        }[]
      }
      consultant_companies_within_radius: {
        Args: { radius_miles: number; user_lat: number; user_lng: number }
        Returns: {
          bio: string
          certifications: string[]
          city: string
          company: string
          consulting_categories: string[]
          created_at: string
          distance_miles: number
          email: string
          first_name: string
          id: string
          industries: string[]
          last_name: string
          latitude: number
          linkedin_url: string
          longitude: number
          name: string
          phone: string
          state: string
          territories: string[]
          title: string
          updated_at: string
          website: string
          years_experience: number
          zip_code: string
        }[]
      }
      equipment_companies_within_radius: {
        Args: { radius_miles: number; user_lat: number; user_lng: number }
        Returns: {
          address: string
          certifications: string[]
          city: string
          company_type: string
          created_at: string
          description: string
          distance_miles: number
          email: string
          employee_count: number
          equipment_categories: string[]
          founded_year: number
          id: string
          latitude: number
          linkedin_url: string
          longitude: number
          name: string
          phone: string
          product_lines: string[]
          state: string
          target_markets: string[]
          updated_at: string
          website: string
          zip_code: string
        }[]
      }
      job_listings_within_radius: {
        Args: { radius_miles: number; user_lat: number; user_lng: number }
        Returns: {
          city: string
          description: string
          distance_miles: number
          employment_type: string
          experience_level: string
          id: string
          is_remote: boolean
          latitude: number
          longitude: number
          salary_max: number
          salary_min: number
          state: string
          title: string
          zip_code: string
        }[]
      }
      pe_firms_within_radius: {
        Args: { radius_miles: number; user_lat: number; user_lng: number }
        Returns: {
          address: string
          city: string
          created_at: string
          description: string
          distance_miles: number
          email: string
          firm_type: string
          founded_year: number
          geographic_focus: string[]
          healthcare_focus: boolean
          id: string
          investment_stage: string[]
          key_contacts: Json
          latitude: number
          linkedin_url: string
          longitude: number
          name: string
          phone: string
          portfolio_companies: string[]
          sector_focus: string[]
          state: string
          total_aum: number
          typical_deal_size_max: number
          typical_deal_size_min: number
          updated_at: string
          website: string
          zip_code: string
        }[]
      }
      process_geocoding_jobs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      providers_within_radius: {
        Args: { radius_miles: number; user_lat: number; user_lng: number }
        Returns: {
          bio: string
          city: string
          distance_miles: number
          first_name: string
          id: string
          last_name: string
          latitude: number
          longitude: number
          name: string
          specializations: string[]
          state: string
        }[]
      }
      schools_within_radius: {
        Args: { radius_miles: number; user_lat: number; user_lng: number }
        Returns: {
          city: string
          description: string
          distance_miles: number
          id: string
          latitude: number
          longitude: number
          name: string
          programs_offered: string[]
          specializations: string[]
          state: string
          zip_code: string
        }[]
      }
      trigger_company_geocoding: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
