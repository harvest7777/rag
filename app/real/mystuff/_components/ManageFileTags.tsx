"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTagStore } from "@/stores/useTagStore";
import TagDisplay from "./TagDisplay";
import { Checkbox } from "@/components/ui/checkbox";
import { createFileTag, deleteFileTag } from "@/app/(api)/file-services";
import { useFileMetadataStore } from "@/stores/useFileMetadataStore";

type Props = {
  className?: string;
  fileMetadata: FileMetadata;
};
export default function ManageFileTags({ className, fileMetadata }: Props) {
  const [open, setOpen] = useState(false);
  const tags = useTagStore((state) => state.tags);
  const fileTags = useFileMetadataStore((state) => state.fileTags);
  const addFileTag = useFileMetadataStore((state) => state.addFileTag);
  const removeFileTag = useFileMetadataStore((state) => state.removeFileTag);

  if (!tags || !fileTags) return null;
  const handleCheck = async (tag: Tag) => {
    const checked = fileTags?.some(
      (ft) => ft.tag_id === tag.id && ft.file_uuid === fileMetadata.file_uuid
    );
    if (!checked) {
      const newFileTag = await createFileTag(fileMetadata.file_uuid, tag.id);
      addFileTag(newFileTag);
    } else {
      const deletedFileTag = await deleteFileTag(
        fileMetadata.file_uuid,
        tag.id
      );
      removeFileTag(deletedFileTag.file_uuid, deletedFileTag.tag_id);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={` ${className}`} variant="ghost">
          Manage Tags
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="line-clamp-1 pr-2">
            {fileMetadata.file_name} Tags
          </DialogTitle>
          <DialogDescription>
            Add or remove tags from your file.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 grid-cols-2">
          {tags?.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2">
              <Checkbox
                onCheckedChange={() => handleCheck(tag)}
                checked={fileTags?.some(
                  (ft) =>
                    ft.tag_id === tag.id &&
                    ft.file_uuid === fileMetadata.file_uuid
                )}
              />
              <TagDisplay tag={tag} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
