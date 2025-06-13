import { Database } from "./database.types";

declare global {
  type SupabaseDatabase = Database;
  type SupabaseTables = Database["public"]["Tables"];
  type FileMetadata = Database["public"]["Tables"]["file_metadata"]["Row"];
  type Tag = Database["public"]["Tables"]["tags"]["Row"];
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];
}

// Required to make the file a module and avoid "Cannot redeclare block-scoped variable" error
export {};
