import type { Database } from "./database.types";

declare global {
  type SupabaseDatabase = Database;
  type SupabaseTables = Database["public"]["Tables"];
  type FileMetadata = Database["public"]["Tables"]["file_metadata"]["Row"];
  type Tag = Database["public"]["Tables"]["tags"]["Row"];
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];
  type Colors = Database["public"]["Enums"]["tag colors"];
  type Message = Database["public"]["Tables"]["messages"]["Row"];
  type Chat = Database["public"]["Tables"]["chats"]["Row"];
  type FileTag = Database["public"]["Tables"]["file_tags"]["Row"];
  type ChatTag = Database["public"]["Tables"]["chat_tags"]["Row"];
}

// Required to make the file a module and avoid "Cannot redeclare block-scoped variable" error
export {};
