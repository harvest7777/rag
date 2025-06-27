"use client";
import Link from "next/link";
import { FaFilePdf } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/useChatStore";

import NewChatButton from "./NewChatButton";
import ChatDisplay from "./ChatDisplay";

type Props = {
  className?: string;
};

export default function ChatSideBar({ className }: Props) {
  const chats = useChatStore((state) => state.chats);
  return (
    <div
      className={`${className} flex flex-col gap-y-2 items-center border-muted border-r-2 text-sm`}
    >
      <NewChatButton />
      <Link href="/real/mystuff" className="w-full">
        <Button variant="sidebar" className="w-full">
          <FaFilePdf />
          Chat Files
        </Button>
      </Link>
      <p className="text-muted-foreground text-left w-full px-4 mt-5">Chats</p>
      {chats
        ?.slice()
        .reverse()
        .map((chat) => (
          <ChatDisplay chat={chat} key={chat.id} />
        ))}
    </div>
  );
}
