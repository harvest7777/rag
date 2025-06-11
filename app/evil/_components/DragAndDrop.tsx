"use client";
import { Button } from "@/components/ui/button";
import { FiUpload } from "react-icons/fi";
type props = {
  className?: string;
};

export default function DragAndDrop({ className }: props) {
  return (
    <div
      className={`text-lg border-dashed border-2 rounded-xl flex flex-col items-center justify-center align-middle text-muted-foreground ${className}`}
    >
      <FiUpload className="text-highlight text-5xl" />
      <span>drag and drop your files here</span>
      <span>or</span>
      <Button variant={"special"}>browse files</Button>
    </div>
  );
}
