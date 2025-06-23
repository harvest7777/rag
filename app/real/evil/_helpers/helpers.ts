import { supabase } from "@/lib/supabase/supabase";
import { PreviousUpload } from "tus-js-client";

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

export const getAllPreviousTusUploadsFromLocalStorage = (): Record<
  string,
  PreviousUpload
> => {
  const uploads: Record<string, PreviousUpload> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    // tus keys start with 'tus::'
    if (!key.startsWith("tus::")) continue;

    try {
      const rawValue = localStorage.getItem(key);
      if (!rawValue) continue;

      const parsed = JSON.parse(rawValue);

      // Defensive check on expected properties
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("uploadUrl" in parsed) ||
        !("metadata" in parsed)
      ) {
        continue;
      }

      // Normalize metadata to string-string map
      const metadataObj: { [key: string]: string } = {};
      if (parsed.metadata && typeof parsed.metadata === "object") {
        for (const [k, v] of Object.entries(parsed.metadata)) {
          metadataObj[k] = String(v);
        }
      }

      uploads[key] = {
        size: typeof parsed.size === "number" ? parsed.size : null,
        metadata: metadataObj,
        creationTime:
          typeof parsed.creationTime === "string" ? parsed.creationTime : "",
        urlStorageKey: key,
        uploadUrl:
          typeof parsed.uploadUrl === "string" ? parsed.uploadUrl : null,
        parallelUploadUrls: Array.isArray(parsed.parallelUploadUrls)
          ? parsed.parallelUploadUrls
          : null,
      };
    } catch {
      // Skip invalid JSON or other errors
      continue;
    }
  }

  return uploads;
};

export const getFileNameFromTusObjectName = (objectName: string): string => {
  // Extract the file name from the object name
  const parts = objectName.split("/");
  return parts.length > 0 ? parts[parts.length - 1] : objectName;
};
