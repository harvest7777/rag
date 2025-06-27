import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState } from "react";
import { permanentlyDeleteFile, restoreFile } from "@/app/(api)/file-services";
import { useFileMetadataStore } from "@/stores/useFileMetadataStore";
import toast from "react-hot-toast";
import { useAuth } from "@/app/auth/AuthContext";

type Props = {
  fileMetadata: FileMetadata;
};

const errorToast = (message: string) => toast.error(message);
const successToast = (message: string) => toast.success(message);

export default function TrashFileOptions({ fileMetadata }: Props) {
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const updateFile = useFileMetadataStore((state) => state.updateFile);
  const removeFile = useFileMetadataStore((state) => state.removeFile);

  const handleDelete = async () => {
    if (!auth?.session?.user?.id) {
      throw new Error("User not authenticated");
    }
    try {
      await permanentlyDeleteFile(
        auth!.session!.user.id,
        fileMetadata.file_name
      );
      removeFile(fileMetadata.file_uuid);
      successToast(`${fileMetadata.file_name} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting file:", error);
      errorToast(`Error deleting ${fileMetadata.file_name}`);
    }
  };
  const handleRestore = async () => {
    try {
      const restoredFile = await restoreFile(fileMetadata.file_uuid);
      updateFile(restoredFile);
      successToast(`${restoredFile.file_name} restored successfully.`);
    } catch (error) {
      console.error("Error restoring file:", error);
      errorToast(`Error restoring ${fileMetadata.file_name}`);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild={true}
        className="click-animation hover:cursor-pointer"
      >
        <Button variant={"ghost"} className="!p-0 !h-6">
          <BsThreeDotsVertical className="text-xl " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit !p-0  overflow-hidden">
        <div onClick={() => setOpen(false)} className="w-min">
          <Button
            variant={"ghost"}
            onClick={() => handleRestore()}
            className="!rounded-none w-full text-left"
          >
            Restore
          </Button>
          <Button
            onClick={() => handleDelete()}
            variant={"destructive"}
            className="!rounded-none w-full text-left "
          >
            Delete Forever
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
