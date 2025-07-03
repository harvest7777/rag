"use client";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useRef, useState } from "react";
import AIThinking from "./AIThinking";

import { IoInformationCircleOutline } from "react-icons/io5";

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
  }, [messages, chatIDToMessages, currentChatID, isLoadingAIResponse]);

  if (currentChatID === null || messages == null) return null;

  return (
    <div
      ref={scrollRef}
      className={`${className} w-full flex flex-col gap-3 overflow-y-scroll scrollbar-hide pt-5 pb-64`}
    >
      {messages.map((message) => (
        // wrapper for placement of messages
        <div
          key={message.id}
          className={`w-full flex   ${
            message.role === "assistant" ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`p-3 px-4 rounded-3xl
          ${message.role === "assistant" ? "" : "bg-muted"}
          `}
          >
            {/* case 1: the message has content and we just display it  */}
            {message.message_content !== "" && <p>{message.message_content}</p>}

            {/* case 2: the assistant is loading its message */}
            <div>
              {message.message_content === "" &&
                isLoadingAIResponse &&
                messages.at(-1) &&
                messages.at(-1)!.id === message.id &&
                message.role === "assistant" && <AIThinking />}
            </div>

            {/* case 3: the assistant had an error while generating its message */}
            {message.message_content === "" &&
              messages.at(-1) &&
              messages.at(-1)!.id !== message.id &&
              message.role === "assistant" && (
                <div className="text-destructive flex items-center align-middle gap-x-2 px-4 p-3 border-destructive border-1 rounded-xl">
                  <IoInformationCircleOutline className="text-xl" />
                  <p>Sowwy! There was an error generating this response.</p>
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
