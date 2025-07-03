import { useChatStore } from "@/stores/useChatStore";
import ChatOptions from "./ChatOptions";
import { useState, useRef, useEffect } from "react";
import { renameChat } from "@/app/(api)/chat-services";

type Props = {
  className?: string;
  chat: Chat;
};
export default function ChatDisplay({ className, chat }: Props) {
  const setCurrentChatID = useChatStore((state) => state.setCurrentChatID);
  const updateChat = useChatStore((state) => state.updateChat);
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const currentChatID = useChatStore((state) => state.currentChatID);
  const handleRename = async () => {
    const renamedChat = await renameChat(chat.id, newName);
    updateChat(renamedChat);
    setEditing(false);
  };
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  return (
    <div
      key={chat.id}
      className={`group w-full flex justify-between items-center ${
        chat.id === currentChatID ? "bg-muted" : ""
      } px-4 py-2 rounded-md hover:cursor-pointer hover:bg-muted transition-colors ${className}`}
    >
      {editing ? (
        <input
          type="text"
          ref={inputRef}
          value={newName}
          placeholder={"New chat name"}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRename();
            }
          }}
          className="border-none outline-none bg-transparent w-full truncate box-border"
        />
      ) : (
        <div
          className={`group-hover:w-4/5 w-full flex items-center`}
          onClick={() => setCurrentChatID(chat.id)}
        >
          <p className="truncate">{chat.chat_name}</p>
        </div>
      )}
      {!editing && (
        <ChatOptions
          chat={chat}
          setEditing={setEditing}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}
    </div>
  );
}
