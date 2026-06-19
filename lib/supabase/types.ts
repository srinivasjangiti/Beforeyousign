/**
 * TypeScript types for Supabase database schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'lawyer' | 'admin';
          company: string | null;
          phone: string | null;
          timezone: string;
          language: string;
          subscription_tier: 'free' | 'pro' | 'business' | 'enterprise';
          subscription_status: string;
          subscription_ends_at: string | null;
          metadata: Json;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'lawyer' | 'admin';
          company?: string | null;
          phone?: string | null;
          timezone?: string;
          language?: string;
          subscription_tier?: 'free' | 'pro' | 'business' | 'enterprise';
          subscription_status?: string;
          subscription_ends_at?: string | null;
          metadata?: Json;
          preferences?: Json;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'lawyer' | 'admin';
          company?: string | null;
          phone?: string | null;
          timezone?: string;
          language?: string;
          subscription_tier?: 'free' | 'pro' | 'business' | 'enterprise';
          subscription_status?: string;
          subscription_ends_at?: string | null;
          metadata?: Json;
          preferences?: Json;
        };
      };
      contracts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          contract_type: string;
          status: 'draft' | 'pending-review' | 'active' | 'expired' | 'terminated' | 'archived';
          file_url: string | null;
          file_name: string | null;
          file_size: number | null;
          file_type: string | null;
          content: string | null;
          content_hash: string | null;
          parties: Json;
          effective_date: string | null;
          expiration_date: string | null;
          risk_score: number | null;
          ai_analysis: Json | null;
          compliance_status: Json | null;
          tags: string[];
          metadata: Json;
          shared_with: string[] | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
          analyzed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          contract_type: string;
          status?: 'draft' | 'pending-review' | 'active' | 'expired' | 'terminated' | 'archived';
          file_url?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          content?: string | null;
          content_hash?: string | null;
          parties?: Json;
          effective_date?: string | null;
          expiration_date?: string | null;
          risk_score?: number | null;
          ai_analysis?: Json | null;
          compliance_status?: Json | null;
          tags?: string[];
          metadata?: Json;
          shared_with?: string[] | null;
          is_public?: boolean;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: 'draft' | 'pending-review' | 'active' | 'expired' | 'terminated' | 'archived';
          content?: string | null;
          risk_score?: number | null;
          ai_analysis?: Json | null;
          compliance_status?: Json | null;
          tags?: string[];
          metadata?: Json;
        };
      };
      contract_versions: {
        Row: {
          id: string;
          contract_id: string;
          version_number: number;
          content: string;
          content_hash: string;
          changes_summary: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          version_number: number;
          content: string;
          content_hash: string;
          changes_summary?: string | null;
          created_by?: string | null;
        };
        Update: {
          changes_summary?: string | null;
        };
      };
      clauses: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          category: string;
          subcategory: string | null;
          clause_type: string | null;
          jurisdiction: string | null;
          industry: string | null;
          risk_level: 'low' | 'medium' | 'high' | 'critical' | null;
          compliance_tags: string[] | null;
          is_template: boolean;
          is_public: boolean;
          usage_count: number;
          ai_tags: Json;
          alternatives: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          category: string;
          subcategory?: string | null;
          clause_type?: string | null;
          jurisdiction?: string | null;
          industry?: string | null;
          risk_level?: 'low' | 'medium' | 'high' | 'critical' | null;
          compliance_tags?: string[] | null;
          is_template?: boolean;
          is_public?: boolean;
          usage_count?: number;
          ai_tags?: Json;
          alternatives?: Json;
        };
        Update: {
          title?: string;
          content?: string;
          category?: string;
          risk_level?: 'low' | 'medium' | 'high' | 'critical' | null;
          is_public?: boolean;
        };
      };
      templates: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          description: string | null;
          category: string;
          content: string;
          variables: Json;
          sections: Json;
          jurisdiction: string | null;
          industry: string | null;
          complexity: 'simple' | 'moderate' | 'complex' | 'expert' | null;
          is_public: boolean;
          is_verified: boolean;
          download_count: number;
          rating: number;
          review_count: number;
          tags: string[] | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          description?: string | null;
          category: string;
          content: string;
          variables?: Json;
          sections?: Json;
          jurisdiction?: string | null;
          industry?: string | null;
          complexity?: 'simple' | 'moderate' | 'complex' | 'expert' | null;
          is_public?: boolean;
          is_verified?: boolean;
          tags?: string[] | null;
          metadata?: Json;
        };
        Update: {
          name?: string;
          description?: string | null;
          content?: string;
          is_public?: boolean;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          contract_id: string | null;
          title: string | null;
          context: string | null;
          created_at: string;
          updated_at: string;
          last_message_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          contract_id?: string | null;
          title?: string | null;
          context?: string | null;
        };
        Update: {
          title?: string | null;
          context?: string | null;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          model: string | null;
          tokens_used: number | null;
          confidence: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          model?: string | null;
          tokens_used?: number | null;
          confidence?: number | null;
        };
        Update: {};
      };
      user_activity: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          resource_type: string | null;
          resource_id: string | null;
          metadata: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          resource_type?: string | null;
          resource_id?: string | null;
          metadata?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {};
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read: boolean;
          read_at: string | null;
          action_url: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read?: boolean;
          action_url?: string | null;
          metadata?: Json;
        };
        Update: {
          is_read?: boolean;
          read_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
