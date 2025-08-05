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
      companies: {
        Row: {
          company_locations: string[] | null
          company_type: string
          created_at: string
          description: string | null
          employee_count: number | null
          founded_year: number | null
          id: string
          name: string
          services: string[] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          company_locations?: string[] | null
          company_type: string
          created_at?: string
          description?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          name: string
          services?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_locations?: string[] | null
          company_type?: string
          created_at?: string
          description?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          name?: string
          services?: string[] | null
          updated_at?: string
          website?: string | null
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
      providers: {
        Row: {
          bio: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          license_number: string
          license_state: string
          name: string
          phone: string | null
          specializations: string[] | null
          state: string | null
          updated_at: string
          website: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_number: string
          license_state: string
          name: string
          phone?: string | null
          specializations?: string[] | null
          state?: string | null
          updated_at?: string
          website?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_number?: string
          license_state?: string
          name?: string
          phone?: string | null
          specializations?: string[] | null
          state?: string | null
          updated_at?: string
          website?: string | null
          years_experience?: number | null
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
      [_ in never]: never
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
