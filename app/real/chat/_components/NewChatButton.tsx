import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/useChatStore";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

type Props = {
  className?: string;
};
export default function NewChatButton({ className }: Props) {
  const setCurrentChatID = useChatStore((state) => state.setCurrentChatID);
  return (
    <Button
      className={`!w-full ${className} `}
      variant="sidebar"
      onClick={() => setCurrentChatID(null)}
    >
      <IoChatboxEllipsesOutline />
      <p>New Chat</p>
    </Button>
  );
}
