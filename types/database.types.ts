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
      chat_tags: {
        Row: {
          chat_id: number | null
          created_at: string
          id: number
          tag_id: number | null
        }
        Insert: {
          chat_id?: number | null
          created_at?: string
          id?: number
          tag_id?: number | null
        }
        Update: {
          chat_id?: number | null
          created_at?: string
          id?: number
          tag_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_tags_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          chat_name: string | null
          created_at: string
          id: number
          owner_uuid: string | null
        }
        Insert: {
          chat_name?: string | null
          created_at?: string
          id?: number
          owner_uuid?: string | null
        }
        Update: {
          chat_name?: string | null
          created_at?: string
          id?: number
          owner_uuid?: string | null
        }
        Relationships: []
      }
      file_content_embeddings: {
        Row: {
          chunk_content: string
          created_at: string
          embedding: string | null
          file_uuid: string
          id: number
        }
        Insert: {
          chunk_content: string
          created_at?: string
          embedding?: string | null
          file_uuid: string
          id?: number
        }
        Update: {
          chunk_content?: string
          created_at?: string
          embedding?: string | null
          file_uuid?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "file_content_embeddings_file_uuid_fkey"
            columns: ["file_uuid"]
            isOneToOne: false
            referencedRelation: "file_metadata"
            referencedColumns: ["file_uuid"]
          },
        ]
      }
      file_metadata: {
        Row: {
          created_at: string
          deleted_at: string | null
          file_bytes: number
          file_name: string
          file_tag: string | null
          file_uuid: string
          id: number
          uuid: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          file_bytes: number
          file_name: string
          file_tag?: string | null
          file_uuid?: string
          id?: number
          uuid?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          file_bytes?: number
          file_name?: string
          file_tag?: string | null
          file_uuid?: string
          id?: number
          uuid?: string | null
        }
        Relationships: []
      }
      file_tags: {
        Row: {
          created_at: string
          file_uuid: string
          id: number
          tag_id: number
        }
        Insert: {
          created_at?: string
          file_uuid: string
          id?: number
          tag_id: number
        }
        Update: {
          created_at?: string
          file_uuid?: string
          id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "file_tags_file_uuid_fkey"
            columns: ["file_uuid"]
            isOneToOne: false
            referencedRelation: "file_metadata"
            referencedColumns: ["file_uuid"]
          },
          {
            foreignKeyName: "file_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: number | null
          created_at: string
          id: number
          message_content: string | null
          role: Database["public"]["Enums"]["chat roles"] | null
        }
        Insert: {
          chat_id?: number | null
          created_at?: string
          id?: number
          message_content?: string | null
          role?: Database["public"]["Enums"]["chat roles"] | null
        }
        Update: {
          chat_id?: number | null
          created_at?: string
          id?: number
          message_content?: string | null
          role?: Database["public"]["Enums"]["chat roles"] | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: number
          sillybucks: number
          tier: string
          uuid: string
        }
        Insert: {
          created_at?: string
          id?: number
          sillybucks?: number
          tier?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          id?: number
          sillybucks?: number
          tier?: string
          uuid?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: number
          tag_color: Database["public"]["Enums"]["tag colors"]
          tag_name: string
          uuid: string
        }
        Insert: {
          created_at?: string
          id?: number
          tag_color: Database["public"]["Enums"]["tag colors"]
          tag_name: string
          uuid: string
        }
        Update: {
          created_at?: string
          id?: number
          tag_color?: Database["public"]["Enums"]["tag colors"]
          tag_name?: string
          uuid?: string
        }
        Relationships: []
      }
      test: {
        Row: {
          chunk_content: string
          created_at: string
          id: number
        }
        Insert: {
          chunk_content: string
          created_at?: string
          id?: number
        }
        Update: {
          chunk_content?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_chat_owner: {
        Args: { chat_id: number }
        Returns: string
      }
      get_file_owner: {
        Args: { f_uuid: string }
        Returns: string
      }
      get_tag_owner: {
        Args: { f_id: number }
        Returns: string
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          created_at: string
          chunk_content: string
          file_uuid: string
        }[]
      }
    }
    Enums: {
      "chat roles": "assistant" | "user"
      "tag colors":
        | "gray"
        | "orange"
        | "yellow"
        | "green"
        | "blue"
        | "purple"
        | "pink"
        | "red"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      "chat roles": ["assistant", "user"],
      "tag colors": [
        "gray",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "pink",
        "red",
      ],
    },
  },
} as const
