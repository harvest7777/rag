"use client";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { LuSendHorizontal, LuTag } from "react-icons/lu";
import { useChatStore } from "@/stores/useChatStore";
import {
  createMessage,
  createChat,
  createBlankAIMessage,
} from "@/app/(api)/chat-services";
import { useAuth } from "@/app/auth/AuthContext";
import ChatMessages from "./ChatMessages";

type Props = {
  className?: string;
};

export default function ChatArea({ className }: Props) {
  const [input, setInput] = useState("");
  const auth = useAuth();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const addChat = useChatStore((state) => state.addChat);
  const currentChatID = useChatStore((state) => state.currentChatID);
  const setCurrentChatID = useChatStore((state) => state.setCurrentChatID);
  const addMessageToChat = useChatStore((state) => state.addMessageToChat);
  const updateLastMessageContent = useChatStore(
    (state) => state.updateLastMessageContent
  );

  useEffect(() => {
    inputRef?.current?.focus();
  }, [currentChatID]);

  if (!auth?.session?.user) return null;

  const handleSend = async () => {
    if (currentChatID === null) {
      const newChat = await createChat(
        auth.session!.user.id,
        `Untitled Chat [${new Date().toLocaleDateString()}]`
      );
      addChat(newChat);
      setCurrentChatID(newChat.id);
      console.log("New chat created", newChat);
    }

    const userInput = input.trim();
    setInput("");
    const newMessage = await createMessage(
      userInput,
      useChatStore.getState().currentChatID!
    );
    // we need to use getstate because the updated current chat id has not been set yet

    addMessageToChat(useChatStore.getState().currentChatID!, newMessage);

    const newAIMessage = await createBlankAIMessage(
      useChatStore.getState().currentChatID!
    );
    addMessageToChat(useChatStore.getState().currentChatID!, newAIMessage);
    // since the user can not send messages while the response is generating,
    // it is safe to assume the last message is the AI message

    const response = await fetch(
      "https://devoted-clean-ghost.ngrok-free.app/ask",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth?.session?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          chat_id: currentChatID,
        }),
      }
    );

    if (!response.ok || !response.body) {
      console.error("Request failed or response body missing");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let fullResponse = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;
      updateLastMessageContent(
        useChatStore.getState().currentChatID!,
        fullResponse
      );
    }

    console.log("Full streamed response:", fullResponse);
  };
  return (
    <div
      className={` ${className} flex flex-col items-center align-middle h-full pb-12`}
    >
      <div className="relative md:w-4/6 w-full h-full max-h-full">
        {/* chat history */}
        <div className="flex flex-col h-full max-h-full w-full align-middle justify-center items-center">
          {currentChatID === null ? (
            <h2 className="text-xl text-muted-foreground mb-24">
              Hello!!! :D What can I help you with today?
            </h2>
          ) : (
            <ChatMessages className="max-h-full" />
          )}
        </div>
        {/* chat controls and input wrapper */}
        <div className="bg-background w-full rounded-t-4xl absolute bottom-0">
          <div className="w-full  resize-none rounded-4xl border shadow-sm  p-2">
            <textarea
              value={input}
              ref={inputRef}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask something..."
              rows={1}
              className="w-full resize-none focus:outline-none p-2"
            />
            {/* chat controls */}
            <div className="flex justify-between">
              <Button variant={"ghost"} size={"icon"} className="!rounded-full">
                <LuTag className="size-5" />
              </Button>

              <Button
                size={"icon"}
                variant={"ghost"}
                className="!rounded-full "
              >
                <LuSendHorizontal className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
