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

export async function uploadUserFile(uid: string, file: File) {
  const filePath = `${uid}/${file.name}`;

  const { data, error } = await supabase.storage
    .from("user-files")
    .upload(filePath, file, {});
  console.log("hi", uid);
  if (error) {
    throw new Error("Upload failed:", error);
  }

  console.log("File uploaded successfully:", data);
  return data;
}

export const getUserFiles = async (uid: string) => {
  const path = `${uid}`;
  console.log(uid);
  const { data, error } = await supabase.storage.from("user-files").list(path);

  if (error) {
    console.error("Error fetching user files:", error);
    throw new Error("Failed to fetch user files");
  }

  console.log(data);
  return data;
};

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

export const getFileUUIDFromPath = async (
  ownerUUID: string,
  fileName: string
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from("user-files")
    .info(`${ownerUUID}/${fileName}`);

  if (error) {
    console.error("Error fetching file UUID:", error);
    throw new Error("Failed to fetch file UUID");
  }

  console.log(data);
  return data.id;
};

export const restoreFile = async (fileUUID: string): Promise<FileMetadata> => {
  /**
   * Restores a deleted file by updating the deleted_at field.
   */
  const { data, error } = await supabase
    .from("file_metadata")
    .update({ deleted_at: null })
    .eq("file_uuid", fileUUID)
    .select("*")
    .single();

  if (error) {
    console.error("Error restoring file:", error);
    throw new Error("Failed to restore file");
  }
  return data;
};

export const permanentlyDeleteFile = async (
  ownerUUID: string,
  fileName: string
): Promise<[string, string]> => {
  /**
   * Permanently deletes a file by removing it from supabase storage.
   * This will trigger a delete on metadata and embeddings.
   * Returns deleted file UUID and path.
   */
  const { data, error } = await supabase.storage
    .from("user-files")
    .remove([`${ownerUUID}/${fileName}`]);
  if (error) {
    console.error("Error permanently deleting file:", error);
    throw new Error("Failed to permanently delete file");
  }
  console.log("File permanently deleted:", data);
  // Name is actually path
  return [data[0].id, data[0].name];
};
