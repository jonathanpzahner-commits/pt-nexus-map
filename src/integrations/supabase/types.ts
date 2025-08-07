export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
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
          company_type: string
          created_at: string
          description: string | null
          employee_count: number | null
          founded_year: number | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
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
          company_type: string
          created_at?: string
          description?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
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
          company_type?: string
          created_at?: string
          description?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          services?: string[] | null
          state?: string | null
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
          created_at: string
          description: string | null
          employment_type: string | null
          experience_level: string | null
          id: string
          is_remote: boolean | null
          posted_by: string | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          state: string
          title: string
          updated_at: string
        }
        Insert: {
          city: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          is_remote?: boolean | null
          posted_by?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          state: string
          title: string
          updated_at?: string
        }
        Update: {
          city?: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          is_remote?: boolean | null
          posted_by?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          state?: string
          title?: string
          updated_at?: string
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
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
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
          name: string
          program_length_months: number | null
          programs_offered: string[] | null
          specializations: string[] | null
          state: string
          tuition_per_year: number | null
          updated_at: string
        }
        Insert: {
          accreditation?: string | null
          average_class_size?: number | null
          city: string
          created_at?: string
          description?: string | null
          faculty_count?: number | null
          id?: string
          name: string
          program_length_months?: number | null
          programs_offered?: string[] | null
          specializations?: string[] | null
          state: string
          tuition_per_year?: number | null
          updated_at?: string
        }
        Update: {
          accreditation?: string | null
          average_class_size?: number | null
          city?: string
          created_at?: string
          description?: string | null
          faculty_count?: number | null
          id?: string
          name?: string
          program_length_months?: number | null
          programs_offered?: string[] | null
          specializations?: string[] | null
          state?: string
          tuition_per_year?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      providers_within_radius: {
        Args: { user_lat: number; user_lng: number; radius_miles: number }
        Returns: {
          id: string
          name: string
          first_name: string
          last_name: string
          city: string
          state: string
          latitude: number
          longitude: number
          specializations: string[]
          bio: string
          distance_miles: number
        }[]
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
