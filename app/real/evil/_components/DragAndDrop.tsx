"use client";
import { Button } from "@/components/ui/button";
import { FiUpload } from "react-icons/fi";
import { useState, useRef } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { bytesToMb } from "../_helpers/helpers";
import toast from "react-hot-toast";
import { useAuth } from "@/app/auth/AuthContext";
import {
  getFileUUIDFromPath,
  uploadFileMetadata,
} from "@/app/(api)/file-services";
import { FaCheck } from "react-icons/fa6";
import { useFileMetadataStore } from "@/stores/useFileMetadata";
import { Progress } from "@/components/ui/progress";
import useFailedUploads from "../_hooks/useFailedUploads";
import { getFileNameFromTusObjectName } from "../_helpers/helpers";
import * as tus from "tus-js-client";
import InfoPopup from "@/components/ui/info-popup";

type props = {
  className?: string;
};

const errorToast = (message: string) => toast.error(message);
const successToast = (message: string) => toast.success(message);
export default function DragAndDrop({ className }: props) {
  const auth = useAuth();
  const addFile = useFileMetadataStore((state) => state.addFile);
  const MAX_FILE_SIZE_MB = 50;
  const MAX_FILES_AT_ONCE = 5;
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [curFiles, setCurFiles] = useState<
    Record<string, [File, number, boolean]>
  >({}); // file name to data
  const {
    failedUploads,
    removeFailedUploadByStorageKey,
    removeFailedUploadByFile,
  } = useFailedUploads();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const removeFile = (fileName: string) => {
    setCurFiles((prevFiles) => {
      const updated = { ...prevFiles };
      delete updated[fileName];
      return updated;
    });
  };

  const handleFilesClient = (selectedFiles: FileList | null) => {
    /* This is responsible for handling ALL operations related to uploading a file
    from your computer. 
    
    Set states of curFiles
    Handle client side file validation*/

    if (!selectedFiles) return;

    // Filter the files to make sure valid
    const incomingFiles = Array.from(selectedFiles);

    if (incomingFiles.some((file) => file.type !== "application/pdf")) {
      errorToast("Only PDF files are supported.");
    }

    if (incomingFiles.some((file) => bytesToMb(file.size) > MAX_FILE_SIZE_MB)) {
      errorToast(`Maximum file size is ${MAX_FILE_SIZE_MB} MB.`);
    }

    // These are the files to be added to use state
    let newFiles = incomingFiles.filter(
      (file) =>
        !(file.name in curFiles) &&
        file.type === "application/pdf" &&
        bytesToMb(file.size) <= MAX_FILE_SIZE_MB
    );

    if (newFiles.length + Object.keys(curFiles).length > MAX_FILES_AT_ONCE) {
      const filesLeft = MAX_FILES_AT_ONCE - Object.keys(curFiles).length;
      errorToast(`You can only upload ${MAX_FILES_AT_ONCE} file at a time.`);
      newFiles = newFiles.slice(0, filesLeft);
    }

    newFiles.forEach(async (file) => {
      setCurFiles((prev) => ({
        ...prev,
        [file.name]: [file, 0, false], // new value for specific key
      }));
      await removeFailedUploadByFile(file);
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFilesClient(event.dataTransfer.files);
    setIsDragging(false);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    let successfulUploadCount = 0;
    await Promise.allSettled(
      Object.entries(curFiles).map(async ([, [file, ,]]) => {
        try {
          if (!auth || !auth.session) {
            new Error("No auth session found when generating presigned url.");
            return;
          }

          await handleTusUpload(file, auth.session.user.id);

          // Tus upload only uploads to storage. We still need to upload metadata
          // and update state
          const fileUUID = await getFileUUIDFromPath(
            auth.session.user.id,
            file.name
          );
          // SUPABASE METADATA UPLOAD
          const fileMetadata = await uploadFileMetadata(
            auth.session.user.id,
            fileUUID,
            file
          );

          // CLIENT SIDE SYNC
          addFile(fileMetadata);

          successfulUploadCount++;
        } catch (error) {
          console.error("Error uploading file:", error);
          errorToast(`${file.name} couldn't be uploaded.`);
        }
      })
    );
    if (successfulUploadCount > 0) {
      successToast(`${successfulUploadCount} files uploaded successfully.`);
    }
    setIsUploading(false);
    setCurFiles({});
  };

  const handleTusUpload = async (file: File, userId: string): Promise<void> => {
    const projectURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const path = `${userId}/${file.name}`;
    const endpoint = `${projectURL}/storage/v1/upload/resumable`;
    const access_token = auth?.session?.access_token;
    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: endpoint,
        retryDelays: [0, 1000, 3000, 5000],
        headers: {
          authorization: `Bearer ${access_token}`,
          "x-upsert": "true",
        },
        chunkSize: 6 * 1024 * 1024, // 6MB chunk size
        metadata: {
          // THIS IS WHERE THE FILE IS UPLOADED TO IN SUPABASE
          bucketName: "user-files",
          objectName: path,
          contentType: file.type,
        },
        removeFingerprintOnSuccess: true,
        onError: function (error) {
          reject(error);
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setCurFiles((prev) => ({
            ...prev,
            [file.name]: [file, parseFloat(percentage), false],
          }));
        },
        onSuccess: function () {
          setCurFiles((prev) => ({
            ...prev,
            [file.name]: [file, 100, true], // TODO: mutate the original value instead of hardcoding
          }));
          resolve();
        },
      });
      upload.findPreviousUploads().then((previousUploads) => {
        /* This works by checking if a file with the exact same footprint exists in 
        local storage. If it does, continue where it left off */
        if (previousUploads.length > 0) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }
        upload.start(); // this is what actually saves the resumed upload
      });
    });
  };

  return (
    <div className={`${className}`}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.stopPropagation();
          handleDrop(e);
        }}
        className={`p-5 text-lg border-dashed border-2 rounded-xl flex flex-col items-center justify-center align-middle gap-y-2 ${
          isDragging ? "border-highlight" : ""
        }`}
      >
        <FiUpload className="text-highlight text-5xl" />
        <div className="text-center text-muted-foreground flex flex-col items-center justify-center align-middle">
          <span>drag and drop your files here</span>
          <span>or</span>
        </div>
        <Button onClick={() => inputRef.current?.click()}>Browse Files</Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (!e.target.files) return;
            handleFilesClient(e.target.files);
            // Have to clear the input value to allow re uploading the same file. This input
            // stores a FileList value which I can not mutate directly.
            e.target.value = "";
          }}
        />
      </div>
      <div className="p-2 flex flex-col items-center align-middle justify-center gap-y-2">
        {Object.keys(curFiles).length > 0 && <h2>Queued Uploads</h2>}
        {Object.entries(curFiles).map(
          ([fileName, [file, status, isDone]], index) => (
            <div key={index} className="w-full">
              <div className="flex items-center w-full gap-x-1">
                <span className="line-clamp-1 flex-1">{fileName}</span>
                <div className="flex items-center gap-x-1 justify-betwee">
                  <span className="text-muted-foreground ">
                    {bytesToMb(file.size)} MB
                  </span>
                  {status < 100 ? (
                    <Button
                      onClick={() => removeFile(fileName)}
                      variant={"ghost"}
                      disabled={isUploading}
                      className="icon click-animation text-muted-foreground hover:text-destructive"
                    >
                      <MdOutlineCancel />
                    </Button>
                  ) : (
                    <Button variant={"ghost"} disabled={true}>
                      <FaCheck className="text-green-500" />
                    </Button>
                  )}
                </div>
              </div>
              <Progress
                value={status}
                className={`w-full ${
                  !isDone && status > 0 && status < 100
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </div>
          )
        )}

        {Object.keys(curFiles).length > 0 && (
          <Button
            variant={"special"}
            loading={isUploading}
            onClick={handleUpload}
          >
            Upload Files
          </Button>
        )}
        {Object.keys(failedUploads).length > 0 && (
          <div className="w-full flex items-center justify-center align-middle gap-x-1">
            <h2 className="text-destructive">Failed Uploads</h2>
            <InfoPopup
              title="Failed Uploads 💔"
              content="These files failed to upload in the past. You can try uploading them again or removing them."
            />
          </div>
        )}
        {Object.entries(failedUploads).map(([tusKey, upload], index) => (
          <div key={index} className="w-full italic text-muted-foreground">
            <div className="flex items-center w-full gap-x-1">
              <span className="line-clamp-1 flex-1">
                {getFileNameFromTusObjectName(upload.metadata.objectName)}
              </span>
              <div className="flex items-center gap-x-1 justify-betwee">
                <span>{bytesToMb(upload.size!)} MB</span>
                <Button
                  onClick={() => removeFailedUploadByStorageKey(tusKey)}
                  variant={"ghost"}
                  disabled={isUploading}
                  className="icon click-animation text-muted-foreground hover:text-destructive"
                >
                  <MdOutlineCancel />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
