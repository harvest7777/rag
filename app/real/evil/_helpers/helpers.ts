import { supabase } from "@/lib/supabase/supabase";

export const uploadFile = async (file: File, presignedUrl: string) => {
  console.log("Uploading file:", file.name);
  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!response.ok) {
    throw new Error(`Failed to upload file: ${file.name}`);
  }
};

export const getPresignedUrl = async (
  fileName: string,
  contentType: string,
  sessionToken: string
): Promise<string> => {
  const { data, error } = await supabase.functions.invoke(
    "generate-presigned-url",
    {
      body: {
        filename: fileName,
        contentType: contentType,
      },
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  if (error) {
    throw new Error(`Failed to get presigned URL: ${error.message}`);
  }
  console.log(data);
  return data;
};

export const bytesToMb = (size: number): number => {
  return Number((size / (1024 * 1024)).toFixed(2));
};
