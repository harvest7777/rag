"use client";
import { Button } from "@/components/ui/button";
import { FiUpload } from "react-icons/fi";
import { useState, useRef } from "react";
import { MdOutlineCancel } from "react-icons/md";
type props = {
  className?: string;
};

export default function DragAndDrop({ className }: props) {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleFiles = (selectedFiles: FileList | null) => {
    console.log("handleFiles called", selectedFiles);
    if (!selectedFiles) return;
    const incomingFiles = Array.from(selectedFiles);
    const newFiles = incomingFiles.filter(
      (file) => !files.some((f) => f.name === file.name)
    );
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const sizeToMb = (size: number) => {
    return (size / (1024 * 1024)).toFixed(2);
  };

  return (
    <div className={`${className}`}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.stopPropagation();
          handleDrop(e);
        }}
        className="p-5 text-lg border-dashed border-2 rounded-xl flex flex-col items-center justify-center align-middle gap-y-2"
      >
        <FiUpload className="text-highlight text-5xl" />
        <div className="text-muted-foreground flex flex-col items-center justify-center align-middle">
          <span>drag and drop your files here</span>
          <span>or</span>
        </div>
        <Button variant={"special"} onClick={() => inputRef.current?.click()}>
          browse files
        </Button>
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
      <div className="p-2 flex flex-col gap-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="line-clamp-1 w-2/3">{file.name}</span>
            <span className="text-muted-foreground">
              {sizeToMb(file.size)} MB
            </span>
            <span
              onClick={() => removeFile(file.name)}
              className="icon click-animation hover:text-destructive"
            >
              <MdOutlineCancel />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
