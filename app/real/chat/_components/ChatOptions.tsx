import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dispatch, SetStateAction, useState } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { deleteChat } from "@/app/(api)/chat-services";
import toast from "react-hot-toast";

type Props = {
  chat: Chat;
  className?: string;
  setEditing: Dispatch<SetStateAction<boolean>>;
};

const errorToast = (message: string) => toast.error(message);
const successToast = (message: string) => toast.success(message);

export default function ChatOptions({ chat, className, setEditing }: Props) {
  const [open, setOpen] = useState(false);
  const deleteChatFromStore = useChatStore((state) => state.deleteChat);
  const handleDeleteChat = async () => {
    try {
      const deletedChat: Chat = await deleteChat(chat.id);
      successToast(`Chat ${deletedChat.chat_name} deleted.`);
      deleteChatFromStore(deletedChat.id);
    } catch (error) {
      console.error("Error deleting file:", error);
      errorToast(`Error deleting ${chat.chat_name}`);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild={true}
        className={`click-animation hover:cursor-pointer ${className} ${
          open && "!opacity-100"
        }`}
      >
        <Button variant={"ghost"} className="!p-0 !h-6">
          <BsThreeDotsVertical className="text-xl " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit !p-0  overflow-hidden">
        <div onClick={() => setOpen(false)} className="w-min">
          <Button
            onClick={() => setEditing(true)}
            variant={"ghost"}
            className="!rounded-none w-full text-left "
          >
            Rename
          </Button>
          <Button
            onClick={() => handleDeleteChat()}
            variant={"destructive"}
            className="!rounded-none w-full text-left "
          >
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
