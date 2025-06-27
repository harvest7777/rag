"use client";
import Spinner from "@/components/ui/spinner";
import FileDisplay from "./FileDisplay";
import { useFileMetadataStore } from "@/stores/useFileMetadataStore";

type Props = {
  className?: string;
};
export default function ManageFiles({ className }: Props) {
  const files = useFileMetadataStore((state) => state.files);

  return (
    <div className={`${className}`}>
      <div className="flex flex-col  w-full items-center">
        <div className="flex gap-3 p-1 font-bold w-full">
          <h2 className="w-1/3">Name</h2>
          <h2 className="w-1/6">Size</h2>
          <h2>Tags</h2>
        </div>

        {!files && <Spinner className="mt-8" />}
        <div className="max-w-full w-full  flex flex-col">
          {files
            ?.filter((file) => !file.deleted_at)
            .map((fileMetadata) => (
              <FileDisplay
                key={fileMetadata.file_uuid}
                className="w-full"
                fileMetadata={fileMetadata}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
