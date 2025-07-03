"use client";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useRef, useState } from "react";
import AIThinking from "./AIThinking";

type Props = {
  className?: string;
  isLoadingAIResponse: boolean;
};
export default function ChatMessages({
  className,
  isLoadingAIResponse,
}: Props) {
  const chatIDToMessages = useChatStore((state) => state.chatIDToMessages);
  const currentChatID = useChatStore((state) => state.currentChatID);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (scrollRef.current && !isLoadingAIResponse) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (currentChatID !== null) {
      setMessages(chatIDToMessages[currentChatID]!);
    }
  }, [chatIDToMessages, currentChatID, isLoadingAIResponse]);

  if (currentChatID === null || messages == null) return null;

  return (
    <div
      ref={scrollRef}
      className={`${className} w-full flex flex-col gap-3  overflow-y-scroll scrollbar-hide pt-5 pb-64`}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`w-full flex  ${
            message.role === "assistant" ? "justify-start" : "justify-end"
          }`}
        >
          <p
            className={`${
              message.role === "assistant" ? "" : "bg-muted"
            } p-3 px-4 rounded-3xl`}
          >
            {message.message_content}
          </p>
          <div>
            {message.message_content === "" &&
              isLoadingAIResponse &&
              message.role === "assistant" && <AIThinking />}
          </div>
        </div>
      ))}
    </div>
  );
}
