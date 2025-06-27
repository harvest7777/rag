import { FaRegStar } from "react-icons/fa";
import CreateTag from "./CreateTag";
import ManageTags from "./ManageTags";
import { FaRegTrashAlt } from "react-icons/fa";
import { GoCloud } from "react-icons/go";
import UploadFileButton from "./UploadFileButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StorageBar from "./StorageBar";

type Props = {
  className?: string;
};
export default function SideBar({ className }: Props) {
  return (
    <div className={`${className} flex flex-col gap-y-2 items-center`}>
      <CreateTag />
      <UploadFileButton />
      <ManageTags />
      <Link href="/real/mystuff/" className="w-full">
        <Button className="w-full" variant="sidebar">
          <FaRegStar />
          My Stuff
        </Button>
      </Link>
      <Link href="/real/mystuff/trash" className="w-full">
        <Button className="w-full" variant="sidebar">
          <FaRegTrashAlt />
          Trash
        </Button>
      </Link>
      <Button className="w-full" variant="sidebar">
        <GoCloud />
        Storage
      </Button>
      {/* storage bar */}
      <StorageBar className="w-11/12" />
    </div>
  );
}
