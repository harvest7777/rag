import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState } from "react";
import { setFileAsDeleted } from "@/app/(api)/file-services";
import { useFileMetadataStore } from "@/stores/useFileMetadataStore";
import toast from "react-hot-toast";
import ManageFileTags from "./ManageFileTags";

type Props = {
  fileMetadata: FileMetadata;
};

const errorToast = (message: string) => toast.error(message);
const successToast = (message: string) => toast.success(message);

export default function FileOptions({ fileMetadata }: Props) {
  const [open, setOpen] = useState(false);
  const updateFile = useFileMetadataStore((state) => state.updateFile);
  const handleTrashFile = async () => {
    try {
      const trashedFile = await setFileAsDeleted(fileMetadata.file_uuid);
      updateFile(trashedFile);
      successToast(`${trashedFile.file_name} moved to trash.`);
    } catch (error) {
      console.error("Error deleting file:", error);
      errorToast(`Error deleting ${fileMetadata.file_name}`);
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
        <div className="w-min">
          <ManageFileTags
            className="!w-full !rounded-none"
            fileMetadata={fileMetadata}
          />
          <Button
            onClick={() => handleTrashFile()}
            variant={"ghost"}
            className="!rounded-none w-full text-left "
          >
            Trash
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
