import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";

type Props = {
  className?: string;
};
export default function UploadFileButton({ className }: Props) {
  return (
    <Button className={`!w-full ${className}`} variant="sidebar">
      <FaPlus className="text-xl" />
      Upload File
    </Button>
  );
}
