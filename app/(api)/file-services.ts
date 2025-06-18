import { supabase } from "@/lib/supabase/supabase";

export const uploadFileMetadata = async (
  ownerUUID: string,
  fileUUID: string,
  file: File
): Promise<FileMetadata> => {
  /**
   * Uploads a single file to the metadata table. This is NOT storage.
   */
  const { data, error } = await supabase
    .from("file_metadata")
    .insert([
      {
        uuid: ownerUUID,
        file_uuid: fileUUID,
        file_name: file.name,
        file_bytes: file.size,
      },
    ])
    .select("*")
    .single();
  if (error) {
    console.error("Error uploading file metadata:", error);
    throw new Error("Failed to upload file metadata");
  }
  return data;
};

export const getFileMetadata = async (): Promise<FileMetadata[]> => {
  const { data, error } = await supabase.from("file_metadata").select("*");
  if (error) {
    console.error("Error fetching file metadata:", error);
    throw new Error("Failed to fetch file metadata");
  }
  return data;
};

export async function uploadUserFile(
  uid: string,
  fileUUID: string,
  file: File
) {
  const filePath = `${uid}/${file.name}`;

  const { data, error } = await supabase.storage
    .from("user-files")
    .upload(filePath, file, {
      metadata: {
        file_uuid: fileUUID,
      },
    });

  if (error) {
    throw new Error("Upload failed:", error);
  }

  return data;
}

export async function setFileAsDeleted(
  fileUUID: string
): Promise<FileMetadata> {
  /**
   * Sets file as "deleted" by updating deleted at and returns the updated file metadata.
   */

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("file_metadata")
    .update({ deleted_at: now })
    .eq("file_uuid", fileUUID)
    .select("*")
    .single();

  if (error) {
    console.error("Error setting file as deleted:", error);
    throw new Error("Failed to set file as deleted");
  }
  return data;
}
