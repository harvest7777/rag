import { bytesToMb } from "@/app/real/evil/_helpers/helpers";
import { FaFilePdf } from "react-icons/fa6";
import TrashFileOptions from "./TrashedFileOptions";

type Props = {
  className?: string;
  fileMetadata: FileMetadata;
};
export default function TrashedFileDisplay({ className, fileMetadata }: Props) {
  return (
    <div
      className={`${className} p-2 flex items-center align-middle gap-3 text-muted-foreground italic`}
    >
      <div className="w-1/3 flex gap-3">
        <FaFilePdf className="min-w-fit text-xl" />
        <h3 className=" line-clamp-1">{fileMetadata.file_name}</h3>
      </div>
      <p className="w-1/6">{bytesToMb(fileMetadata.file_bytes)} MB</p>
      <div className="w-5/12 overflow-hidden">
        <h3>3d</h3>
      </div>
      <div className="flex-1 text-xl flex flex-row-reverse ">
        <TrashFileOptions fileMetadata={fileMetadata} />
      </div>
    </div>
  );
}
