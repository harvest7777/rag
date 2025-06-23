import { useEffect } from "react";
import * as tus from "tus-js-client";
import { supabase } from "@/lib/supabase/supabase";

export default function TusUploader() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  useEffect(() => {
    const uploadFile = async () => {
      const fileInput = document.getElementById("upload") as HTMLInputElement;
      if (!fileInput || !fileInput.files?.[0]) return;

      const file = fileInput.files[0];

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const upload = new tus.Upload(file, {
        endpoint: `${supabaseUrl}/storage/v1/upload/resumable`, // ✅ Supabase TUS endpoint
        headers: {
          authorization: `Bearer ${accessToken}`,
          apikey: "your-anon-or-service-role-key",
        },
        metadata: {
          bucketName: "your-bucket-name",
          objectName: file.name,
          contentType: file.type,
          cacheControl: "3600",
        },
        onError: (error) => {
          console.error("Upload failed:", error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percent = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(`Upload progress: ${percent}%`);
        },
        onSuccess: () => {
          console.log("Upload finished:", upload.url);
        },
      });

      upload.start();
    };

    // Listen for file input change
    const input = document.getElementById("upload") as HTMLInputElement;
    input?.addEventListener("change", uploadFile);

    return () => input?.removeEventListener("change", uploadFile);
  }, []);

  return (
    <div>
      <input type="file" id="upload" />
    </div>
  );
}
