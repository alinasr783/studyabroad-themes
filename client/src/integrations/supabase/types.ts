export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          author_avatar: string | null
          author_name: string | null
          category: string | null
          client_id: string | null
          content_ar: string
          content_en: string
          created_at: string
          excerpt_ar: string | null
          excerpt_en: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          title_ar: string
          title_en: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_avatar?: string | null
          author_name?: string | null
          category?: string | null
          client_id?: string | null
          content_ar: string
          content_en: string
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          title_ar: string
          title_en: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_avatar?: string | null
          author_name?: string | null
          category?: string | null
          client_id?: string | null
          content_ar?: string
          content_en?: string
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          reading_time?: number | null
          slug?: string
          tags?: string[] | null
          title_ar?: string
          title_en?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          deployment_status: string | null
          description: string | null
          github_repo_url: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          primary_color_1: string
          primary_color_2: string
          primary_color_3: string
          slug: string
          updated_at: string
          vercel_url: string | null
        }
        Insert: {
          created_at?: string
          deployment_status?: string | null
          description?: string | null
          github_repo_url?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          primary_color_1?: string
          primary_color_2?: string
          primary_color_3?: string
          slug: string
          updated_at?: string
          vercel_url?: string | null
        }
        Update: {
          created_at?: string
          deployment_status?: string | null
          description?: string | null
          github_repo_url?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          primary_color_1?: string
          primary_color_2?: string
          primary_color_3?: string
          slug?: string
          updated_at?: string
          vercel_url?: string | null
        }
        Relationships: []
      }
      consultations: {
        Row: {
          budget_range: string | null
          client_id: string | null
          country_preference: string | null
          created_at: string
          email: string
          field_of_interest: string | null
          full_name: string
          id: string
          message: string | null
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          status: string | null
          study_level: string | null
          updated_at: string
        }
        Insert: {
          budget_range?: string | null
          client_id?: string | null
          country_preference?: string | null
          created_at?: string
          email: string
          field_of_interest?: string | null
          full_name: string
          id?: string
          message?: string | null
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string | null
          study_level?: string | null
          updated_at?: string
        }
        Update: {
          budget_range?: string | null
          client_id?: string | null
          country_preference?: string | null
          created_at?: string
          email?: string
          field_of_interest?: string | null
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string | null
          study_level?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          client_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          phone: string | null
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          phone?: string | null
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          client_id: string | null
          climate: string | null
          created_at: string
          currency: string | null
          description_ar: string | null
          description_en: string | null
          flag_url: string | null
          id: string
          image_url: string | null
          is_trending: boolean | null
          language: string | null
          living_cost_max: number | null
          living_cost_min: number | null
          name_ar: string
          name_en: string
          popular_cities: string[] | null
          slug: string
          study_cost_max: number | null
          study_cost_min: number | null
          updated_at: string
          visa_requirements_ar: string | null
          visa_requirements_en: string | null
        }
        Insert: {
          client_id?: string | null
          climate?: string | null
          created_at?: string
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          flag_url?: string | null
          id?: string
          image_url?: string | null
          is_trending?: boolean | null
          language?: string | null
          living_cost_max?: number | null
          living_cost_min?: number | null
          name_ar: string
          name_en: string
          popular_cities?: string[] | null
          slug: string
          study_cost_max?: number | null
          study_cost_min?: number | null
          updated_at?: string
          visa_requirements_ar?: string | null
          visa_requirements_en?: string | null
        }
        Update: {
          client_id?: string | null
          climate?: string | null
          created_at?: string
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          flag_url?: string | null
          id?: string
          image_url?: string | null
          is_trending?: boolean | null
          language?: string | null
          living_cost_max?: number | null
          living_cost_min?: number | null
          name_ar?: string
          name_en?: string
          popular_cities?: string[] | null
          slug?: string
          study_cost_max?: number | null
          study_cost_min?: number | null
          updated_at?: string
          visa_requirements_ar?: string | null
          visa_requirements_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "countries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      managers: {
        Row: {
          client_id: string | null
          created_at: string
          email: string
          id: string
          password: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          email: string
          id?: string
          password: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          email?: string
          id?: string
          password?: string
        }
        Relationships: [
          {
            foreignKeyName: "managers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          application_deadline: string | null
          career_prospects_ar: string | null
          career_prospects_en: string | null
          client_id: string | null
          country_id: string | null
          created_at: string
          degree_level: string
          description_ar: string | null
          description_en: string | null
          duration_months: number | null
          duration_years: number | null
          field_of_study: string
          id: string
          is_featured: boolean | null
          language: string | null
          name_ar: string
          name_en: string
          requirements_ar: string | null
          requirements_en: string | null
          slug: string
          start_date: string | null
          tuition_fee: number | null
          university_id: string | null
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          career_prospects_ar?: string | null
          career_prospects_en?: string | null
          client_id?: string | null
          country_id?: string | null
          created_at?: string
          degree_level: string
          description_ar?: string | null
          description_en?: string | null
          duration_months?: number | null
          duration_years?: number | null
          field_of_study: string
          id?: string
          is_featured?: boolean | null
          language?: string | null
          name_ar: string
          name_en: string
          requirements_ar?: string | null
          requirements_en?: string | null
          slug: string
          start_date?: string | null
          tuition_fee?: number | null
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          career_prospects_ar?: string | null
          career_prospects_en?: string | null
          client_id?: string | null
          country_id?: string | null
          created_at?: string
          degree_level?: string
          description_ar?: string | null
          description_en?: string | null
          duration_months?: number | null
          duration_years?: number | null
          field_of_study?: string
          id?: string
          is_featured?: boolean | null
          language?: string | null
          name_ar?: string
          name_en?: string
          requirements_ar?: string | null
          requirements_en?: string | null
          slug?: string
          start_date?: string | null
          tuition_fee?: number | null
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          client_id: string
          created_at: string | null
          email: string | null
          facebook_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          logo_url: string | null
          office_location: string | null
          primary_color_1: string | null
          primary_color_2: string | null
          primary_color_3: string | null
          show_articles_section: boolean | null
          show_countries_section: boolean | null
          show_programs_section: boolean | null
          show_testimonials_section: boolean | null
          show_universities_section: boolean | null
          site_name_ar: string | null
          site_name_en: string | null
          twitter_url: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          office_location?: string | null
          primary_color_1?: string | null
          primary_color_2?: string | null
          primary_color_3?: string | null
          show_articles_section?: boolean | null
          show_countries_section?: boolean | null
          show_programs_section?: boolean | null
          show_testimonials_section?: boolean | null
          show_universities_section?: boolean | null
          site_name_ar?: string | null
          site_name_en?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          office_location?: string | null
          primary_color_1?: string | null
          primary_color_2?: string | null
          primary_color_3?: string | null
          show_articles_section?: boolean | null
          show_countries_section?: boolean | null
          show_programs_section?: boolean | null
          show_testimonials_section?: boolean | null
          show_universities_section?: boolean | null
          site_name_ar?: string | null
          site_name_en?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          client_id: string | null
          content_ar: string
          content_en: string
          country: string | null
          created_at: string
          id: string
          image_url: string | null
          is_published: boolean | null
          name_ar: string
          name_en: string
          program: string | null
          rating: number | null
          university: string | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          content_ar: string
          content_en: string
          country?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          name_ar: string
          name_en: string
          program?: string | null
          rating?: number | null
          university?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          content_ar?: string
          content_en?: string
          country?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          name_ar?: string
          name_en?: string
          program?: string | null
          rating?: number | null
          university?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          accreditation: string | null
          admission_requirements_ar: string | null
          admission_requirements_en: string | null
          client_id: string | null
          country_id: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          established_year: number | null
          facilities: string[] | null
          id: string
          image_url: string | null
          international_student_count: number | null
          is_featured: boolean | null
          location: string | null
          logo_url: string | null
          name_ar: string
          name_en: string
          ranking: number | null
          slug: string
          student_count: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          accreditation?: string | null
          admission_requirements_ar?: string | null
          admission_requirements_en?: string | null
          client_id?: string | null
          country_id?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          established_year?: number | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          international_student_count?: number | null
          is_featured?: boolean | null
          location?: string | null
          logo_url?: string | null
          name_ar: string
          name_en: string
          ranking?: number | null
          slug: string
          student_count?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          accreditation?: string | null
          admission_requirements_ar?: string | null
          admission_requirements_en?: string | null
          client_id?: string | null
          country_id?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          established_year?: number | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          international_student_count?: number | null
          is_featured?: boolean | null
          location?: string | null
          logo_url?: string | null
          name_ar?: string
          name_en?: string
          ranking?: number | null
          slug?: string
          student_count?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "universities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "universities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
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