"use client";
import { useState, useEffect } from "react";
import { PreviousUpload } from "tus-js-client";
import { getAllPreviousTusUploadsFromLocalStorage } from "../_helpers/helpers";
import * as tus from "tus-js-client";

export default function useFailedUploads() {
  const [failedUploads, setFailedUploads] = useState<
    Record<string, PreviousUpload>
  >({});

  const removeFailedUploadByStorageKey = (urlStorageKey: string) => {
    /* Delete the failed upload from local storage and the state.
    THIS WILL FULLY DELETE ALL UPLOAD PROGRESS!!!*/
    localStorage.removeItem(urlStorageKey);
    setFailedUploads((prev) => {
      const newUploads = { ...prev };
      delete newUploads[urlStorageKey];
      return newUploads;
    });
  };
  const removeFailedUploadByFile = async (file: File) => {
    /* Delete the failed upload from state by file. This will be used for removing from the 
    failed upload list when the user reuploads the same file. THIS DOES NOT REMOVE FROM
    STORAGE, UPLOAD PROGRESS IS PERSISTED*/

    const fingerprint = await tus.defaultOptions.fingerprint(file, {});
    setFailedUploads((prev) => {
      const newUploads: typeof prev = {};
      for (const key in prev) {
        // The actual key is tus::fingerprint/supabase url so we can't
        // delete from the key by itself
        if (!key.includes(fingerprint)) {
          newUploads[key] = prev[key];
        }
      }
      return newUploads;
    });
  };

  useEffect(() => {
    // A failed upload is deduced because it's still in local storage.
    setFailedUploads(getAllPreviousTusUploadsFromLocalStorage());
  }, []);

  return {
    failedUploads,
    removeFailedUploadByStorageKey,
    removeFailedUploadByFile,
  };
}
