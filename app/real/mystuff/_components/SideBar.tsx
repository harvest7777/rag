import { FaRegStar } from "react-icons/fa";
import CreateTag from "./CreateTag";
import { FaRegTrashAlt } from "react-icons/fa";
import { GoCloud } from "react-icons/go";
import UploadFileButton from "./UploadFileButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  className?: string;
};
export default function SideBar({ className }: Props) {
  // const tags = useTagStore((state) => state.tags);
  return (
    <div className={`${className} flex flex-col gap-y-2 items-center`}>
      <CreateTag />
      <UploadFileButton />
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
      <div className="w-11/12 bg-muted rounded-full overflow-hidden">
        <div className="h-1 bg-highlight w-1/2 z-10"></div>
      </div>
      <span className="text-xs text-left w-11/12">5 GB of 10 GB used</span>
    </div>
  );
}
