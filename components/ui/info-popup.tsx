import { IoInformationCircleOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  title: string;
  content: string;
};
export default function InfoPopup({ title, content }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="p-0">
          <IoInformationCircleOutline />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">{title}</h4>
            <p className="text-muted-foreground text-sm">{content}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
