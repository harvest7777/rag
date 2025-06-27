"use client";
import { useFileMetadataStore } from "@/stores/useFileMetadataStore";
import { bytesToMb } from "../../evil/_helpers/helpers";

type Props = {
  className?: string;
};

export default function StorageBar({ className }: Props) {
  /* This component is purely front end so we don't need to check if the bytes used exceeds cacpacity. 
    All integrity checks are done by our backend. */
  const files = useFileMetadataStore((state) => state.files);
  // TODO check from user profile
  const MAX_MB = 10; // 10 GB in MB
  const getBytesUsed = () => {
    let totalBytes = 0;
    files?.forEach((file) => {
      if (file.file_bytes) {
        totalBytes += file.file_bytes;
      }
    });
    return totalBytes;
  };
  const percentageUsed = (bytesToMb(getBytesUsed()) / MAX_MB) * 100;
  return (
    <div className={className}>
      <div className="w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-1 bg-highlight z-10 transition-all duration-300"
          style={{ width: `${percentageUsed}%` }}
        ></div>
      </div>
      <span className="text-xs text-left w-11/12">
        {bytesToMb(getBytesUsed())} MB of {MAX_MB} MB used
      </span>
    </div>
  );
}
