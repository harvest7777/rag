import { bytesToMb } from "../../evil/_helpers/helpers";
import { FaFilePdf } from "react-icons/fa6";
import FileOptions from "./FileOptions";
import { useFileMetadataStore } from "@/stores/useFileMetadataStore";
import TagDisplay from "./TagDisplay";
import { useTagStore } from "@/stores/useTagStore";

type Props = {
  className?: string;
  fileMetadata: FileMetadata;
};
export default function FileDisplay({ className, fileMetadata }: Props) {
  const fileTags = useFileMetadataStore((state) => state.fileTags);
  const tags = useTagStore((state) => state.tags);
  return (
    <div className={`${className} p-2 flex items-center align-middle gap-3`}>
      <div className="w-1/3 flex gap-3">
        <FaFilePdf className="min-w-fit text-xl text-red-500" />
        <h3 className=" line-clamp-1">{fileMetadata.file_name}</h3>
      </div>
      <p className="w-1/6">{bytesToMb(fileMetadata.file_bytes)} MB</p>
      <div className="w-5/12 overflow-hidden">
        <div className="flex gap-2 flex-wrap">
          {fileTags
            ?.filter((ft) => ft.file_uuid === fileMetadata.file_uuid)
            .map((ft) => (
              <TagDisplay
                key={ft.id}
                tag={tags!.find((t) => t.id === ft.tag_id)!}
              />
            ))}
        </div>
      </div>
      <div className="flex-1 text-xl flex flex-row-reverse ">
        <FileOptions fileMetadata={fileMetadata} />
      </div>
    </div>
  );
}
