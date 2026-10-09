// Hand-written types mirroring supabase/migrations/0001_init.sql.
// Once your Supabase project is running, regenerate the authoritative
// version with:
//   npx supabase gen types typescript --project-id <your-project-ref> > src/lib/types/database.ts

export type UserRole = "learner" | "teacher" | "school_admin" | "super_admin";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseMode = "online" | "offline" | "hybrid";
export type CourseStatus = "draft" | "pending" | "published" | "rejected";
export type SchoolStatus = "pending" | "approved" | "rejected";
export type AdStatus = "pending" | "approved" | "rejected" | "expired";
export type AdTarget = "school" | "course" | "event";
export type SubscriptionPlan = "free" | "basic" | "pro" | "enterprise";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          headline: string | null;
          skills: string[] | null;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          role: UserRole;
          full_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      categories: {
        Row: { id: string; name: string; slug: string; created_at: string };
        Insert: { id?: string; name: string; slug: string };
        Update: Partial<{ name: string; slug: string }>;
        Relationships: [];
      };
      schools: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          location: string | null;
          website_url: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          status: SchoolStatus;
          subscription_plan: SubscriptionPlan;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["schools"]["Row"]> & {
          owner_id: string;
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["schools"]["Row"]>;
        Relationships: [];
      };
      school_teachers: {
        Row: {
          id: string;
          school_id: string;
          teacher_id: string;
          created_at: string;
        };
        Insert: { id?: string; school_id: string; teacher_id: string };
        Update: Partial<{ school_id: string; teacher_id: string }>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          school_id: string | null;
          teacher_id: string;
          category_id: string | null;
          title: string;
          slug: string;
          description: string | null;
          thumbnail_url: string | null;
          level: CourseLevel;
          mode: CourseMode;
          language: string;
          price_dzd: number;
          status: CourseStatus;
          duration_hours: number | null;
          rating_avg: number;
          rating_count: number;
          students_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["courses"]["Row"]> & {
          teacher_id: string;
          title: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "courses_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "courses_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      course_lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          content: string | null;
          video_url: string | null;
          order_index: number;
          duration_minutes: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["course_lessons"]["Row"]> & {
          course_id: string;
          title: string;
          order_index: number;
        };
        Update: Partial<Database["public"]["Tables"]["course_lessons"]["Row"]>;
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          learner_id: string;
          course_id: string;
          status: "active" | "completed" | "cancelled";
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: { id?: string; learner_id: string; course_id: string; status?: string };
        Update: Partial<{ status: string; completed_at: string | null }>;
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          learner_id: string;
          lesson_id: string;
          course_id: string;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          learner_id: string;
          lesson_id: string;
          course_id: string;
          completed?: boolean;
        };
        Update: Partial<{ completed: boolean; completed_at: string | null }>;
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          learner_id: string;
          course_id: string;
          certificate_code: string;
          issued_at: string;
        };
        Insert: { id?: string; learner_id: string; course_id: string; certificate_code: string };
        Update: never;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          learner_id: string;
          course_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: { id?: string; learner_id: string; course_id: string; rating: number; comment?: string | null };
        Update: Partial<{ rating: number; comment: string | null }>;
        Relationships: [];
      };
      favorites: {
        Row: {
          id: string;
          learner_id: string;
          target_type: "course" | "school" | "teacher";
          target_id: string;
          created_at: string;
        };
        Insert: { id?: string; learner_id: string; target_type: string; target_id: string };
        Update: never;
        Relationships: [];
      };
      advertisements: {
        Row: {
          id: string;
          school_id: string;
          target_type: AdTarget;
          target_id: string | null;
          title: string;
          image_url: string | null;
          status: AdStatus;
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["advertisements"]["Row"]> & {
          school_id: string;
          target_type: AdTarget;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["advertisements"]["Row"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: { id?: string; user_id: string; type: string; title: string; message?: string | null };
        Update: Partial<{ read: boolean }>;
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          learner_id: string;
          course_id: string | null;
          school_id: string | null;
          amount_dzd: number;
          status: "pending" | "succeeded" | "failed" | "refunded";
          provider: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["transactions"]["Row"]> & {
          learner_id: string;
          amount_dzd: number;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Row"]>;
        Relationships: [];
      };
      platform_settings: {
        Row: { key: string; value: string; updated_at: string };
        Insert: { key: string; value: string };
        Update: Partial<{ value: string }>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
  };
}
