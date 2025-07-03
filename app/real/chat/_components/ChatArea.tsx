"use client";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { LuSendHorizontal, LuTag } from "react-icons/lu";
import { useChatStore } from "@/stores/useChatStore";
import {
  insertMessage,
  createChat,
  updateMessageContent,
} from "@/app/(api)/chat-services";
import { useAuth } from "@/app/auth/AuthContext";
import ChatMessages from "./ChatMessages";

type Props = {
  className?: string;
};

export default function ChatArea({ className }: Props) {
  const [input, setInput] = useState("");
  const [isLoadingAIResponse, setIsLoadingAIResponse] =
    useState<boolean>(false);
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

  const sendUserMessage = async (message: string, chatId: number) => {
    /**This is responsible for handling a user sending their message. This will update the DB
     * and store with the new user message
     */
    const newMessage = await insertMessage(message, "user", chatId);
    // we need to use getstate because the updated current chat id has not been set yet
    addMessageToChat(useChatStore.getState().currentChatID!, newMessage);
  };

  const handleAssistantResponse = async (
    userMessage: string,
    chatId: number
  ) => {
    /**We will handle the assistant response with streaming. Insert null response -> update at the end
     * The null response will be used to deduce if there was an error in generating the response on the front end
     */
    setIsLoadingAIResponse(true);
    const newMessage = await insertMessage("", "assistant", chatId);

    addMessageToChat(useChatStore.getState().currentChatID!, newMessage);

    // this is a streamed response, we will be updating our last message in our store
    // with the new chunks of data
    const response = await fetch(
      "https://devoted-clean-ghost.ngrok-free.app/ask",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth?.session?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
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
    setIsLoadingAIResponse(true);
    await updateMessageContent(newMessage.id, fullResponse);
  };

  const handleSend = async () => {
    if (currentChatID === null) {
      const newChat = await createChat(
        auth.session!.user.id,
        `Untitled Chat [${new Date().toLocaleDateString()}]`
      );
      addChat(newChat);
      setCurrentChatID(newChat.id);
    }

    const userInput = input.trim();
    setInput("");

    await sendUserMessage(userInput, useChatStore.getState().currentChatID!);
    await handleAssistantResponse(
      userInput,
      useChatStore.getState().currentChatID!
    );
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
            <ChatMessages
              isLoadingAIResponse={isLoadingAIResponse}
              className="max-h-full"
            />
          )}
        </div>
        {/* chat controls and input wrapper */}
        <div className="bg-background w-full rounded-t-4xl absolute bottom-0">
          <div className="w-full rounded-4xl border shadow-sm p-2 box-border">
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
              className="w-full resize-none focus:outline-none p-2 min-h-[40px] max-h-[120px] overflow-y-auto box-border overflow-x-hidden"
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
