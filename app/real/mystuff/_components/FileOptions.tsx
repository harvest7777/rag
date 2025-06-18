import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState } from "react";
import { setFileAsDeleted } from "@/app/(api)/file-services";
import { useFileMetadataStore } from "@/stores/useFileMetadata";
import toast from "react-hot-toast";

type Props = {
  fileMetadata: FileMetadata;
};

const errorToast = (message: string) => toast.error(message);
const successToast = (message: string) => toast.success(message);

export default function FileOptions({ fileMetadata }: Props) {
  const [open, setOpen] = useState(false);
  const updateFile = useFileMetadataStore((state) => state.updateFile);
  const handleDelete = async () => {
    try {
      const deletedFile = await setFileAsDeleted(fileMetadata.file_uuid);
      updateFile(deletedFile);
      successToast(`${deletedFile.file_name} deleted successfully.`);
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
        <div onClick={() => setOpen(false)} className="w-min">
          <Button
            onClick={() => handleDelete()}
            variant={"destructive"}
            className="!rounded-none w-full text-left "
          >
            Delete
          </Button>

          <Button variant={"ghost"} className="!rounded-none w-full text-left">
            Add Tag
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
