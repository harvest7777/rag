"use client";
import { Button } from "@/components/ui/button";
import { FiUpload } from "react-icons/fi";
import { useState, useRef } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { getPresignedUrl, uploadFile, bytesToMb } from "../_helpers/helpers";
import toast from "react-hot-toast";
import { useAuth } from "@/app/auth/AuthContext";
import { uploadFileMetadata } from "@/app/(api)/file-services";
import { v4 as uuidv4 } from "uuid";

type props = {
  className?: string;
};

const errorToast = (message: string) => toast.error(message);
const successToast = (message: string) => toast.success(message);
export default function DragAndDrop({ className }: props) {
  const auth = useAuth();
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILES_AT_ONCE = 5;
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const removeFile = (fileName: string) => {
    if (isUploading) return;
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleFiles = (selectedFiles: FileList | null) => {
    console.log("handleFiles called", selectedFiles);
    if (!selectedFiles) return;
    const incomingFiles = Array.from(selectedFiles);

    if (incomingFiles.some((file) => file.type !== "application/pdf")) {
      errorToast("Only PDF files are supported.");
    }

    if (incomingFiles.some((file) => bytesToMb(file.size) > MAX_FILE_SIZE_MB)) {
      errorToast(`Maximum file size is ${MAX_FILE_SIZE_MB} MB.`);
    }
    let newFiles = incomingFiles.filter(
      (file) =>
        !files.some((f) => f.name === file.name) &&
        file.type === "application/pdf" &&
        bytesToMb(file.size) <= MAX_FILE_SIZE_MB
    );

    if (newFiles.length + files.length > MAX_FILES_AT_ONCE) {
      const filesLeft = MAX_FILES_AT_ONCE - files.length;
      errorToast(`You can only upload ${MAX_FILES_AT_ONCE} file at a time.`);
      newFiles = newFiles.slice(0, filesLeft);
    }

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
    setIsDragging(false);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    await Promise.allSettled(
      files.map(async (file) => {
        try {
          if (!auth || !auth.session) {
            new Error("No auth session found when generating presigned url.");
            return;
          }
          const presignedUrl = await getPresignedUrl(
            file.name,
            file.type,
            auth.session.access_token
          );
          await uploadFile(file, presignedUrl);
          const fileUUID = uuidv4();
          await uploadFileMetadata(auth.session.user.id, fileUUID, file);
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
        }
      })
    );
    setIsUploading(false);
    setFiles([]);
    successToast("Files uploaded successfully!");
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
            handleFiles(e.target.files);
            // Have to clear the input value to allow re uploading the same file. This input
            // stores a FileList value which I can not mutate directly.
            e.target.value = "";
          }}
        />
      </div>
      <div className="p-2 flex flex-col items-center align-middle justify-center gap-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between w-full gap-x-1"
          >
            <span className="line-clamp-1">{file.name}</span>
            <div className="flex items-center gap-x-1">
              <span className="text-muted-foreground min-w-fit">
                {bytesToMb(file.size)} MB
              </span>
              <Button
                onClick={() => removeFile(file.name)}
                variant={"ghost"}
                disabled={isUploading}
                className="icon click-animation text-muted-foreground hover:text-destructive"
              >
                <MdOutlineCancel />
              </Button>
            </div>
          </div>
        ))}
        {files.length > 0 && (
          <Button
            variant={"special"}
            loading={isUploading}
            onClick={handleUpload}
          >
            Upload Files
          </Button>
        )}
      </div>
    </div>
  );
}
