import { bytesToMb } from "../../evil/_helpers/helpers";
import { FaFilePdf } from "react-icons/fa6";
import TagDisplay from "./TagDisplay";
import FileOptions from "./FileOptions";

type Props = {
  className?: string;
  fileMetadata: FileMetadata;
};
export default function FileDisplay({ className, fileMetadata }: Props) {
  const fakeTags = ["school", "aaa tag", "work", "tag3"]; // Placeholder for tags
  return (
    <div className={`${className} p-2 flex items-center align-middle gap-3`}>
      <div className="w-1/3 flex gap-3">
        <FaFilePdf className="min-w-fit text-xl text-red-500" />
        <h3 className=" line-clamp-1">{fileMetadata.file_name}</h3>
      </div>
      <p className="w-1/6">{bytesToMb(fileMetadata.file_bytes)} MB</p>
      <div className="w-5/12 overflow-hidden">
        <div className="flex gap-2 flex-wrap">
          {fakeTags.map((tag) => (
            <TagDisplay key={tag} tag={tag} />
          ))}
        </div>
      </div>
      <div className="flex-1 text-xl flex flex-row-reverse ">
        <FileOptions fileMetadata={fileMetadata} />
      </div>
    </div>
  );
}
