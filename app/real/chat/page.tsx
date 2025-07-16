"use client";
import { useAuth } from "@/app/auth/AuthContext";
import ChatArea from "./_components/ChatArea";
import ChatSideBar from "./_components/ChatSideBar";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";
import {
  fetchChatTags,
  getChats,
  getMessagesForChat,
} from "@/app/(api)/chat-services";

export default function ChatPage() {
  const auth = useAuth();
  const chats = useChatStore((state) => state.chats);
  const addMessageToChat = useChatStore((state) => state.addMessageToChat);
  const setChats = useChatStore((state) => state.setChats);
  const setLastValidated = useChatStore((state) => state.setLastValidated);
  const currentChatID = useChatStore((state) => state.currentChatID);
  const hasHydrated = useChatStore((state) => state.hasHydrated);
  const chatIDToMessages = useChatStore((state) => state.chatIDToMessages);
  const setMessagesToChat = useChatStore((state) => state.setMessagesToChat);
  const setChatIDToMessages = useChatStore(
    (state) => state.setChatIDToMessages
  );
  const setChatTags = useChatStore((state) => state.setChatTags);

  useEffect(() => {
    const init = async () => {
      // only fetch the chats to save memory. fetch messages if user selects a chat
      const now = Date.now();
      const fetchedChats = await getChats();
      const newChatIds = fetchedChats.map((chat) => chat.id);
      const chatIDToEmptyMessages: Record<number, Message[] | null> =
        Object.fromEntries(newChatIds.map((id) => [id, null]));
      setChats(fetchedChats);
      setChatIDToMessages(chatIDToEmptyMessages);
      const fetchedChatTags = await fetchChatTags();
      setChatTags(fetchedChatTags);
      setLastValidated(now);
    };
    if (hasHydrated && chats == null) {
      init();
    }

    // const channel = supabase
    //   .channel("listen-for-ai-responses")
    //   .on(
    //     "postgres_changes",
    //     { event: "INSERT", schema: "public", table: "messages" },
    //     (payload) => {
    //       const newMessage = payload.new as Message;
    //       if (newMessage.role === "assistant") {
    //         addMessageToChat(newMessage.chat_id!, newMessage);
    //       }
    //     }
    //   )
    //   .subscribe((status) =>
    //     console.log("supabase chat listener status", status)
    //   );

    return () => {
      // channel.unsubscribe();
    };
  }, [
    hasHydrated,
    chats,
    setChats,
    addMessageToChat,
    setLastValidated,
    setChatIDToMessages,
  ]);
  useEffect(() => {
    const fetchAndSetMessages = async () => {
      if (currentChatID && chatIDToMessages[currentChatID] === null) {
        const fetchedMessages = await getMessagesForChat(currentChatID);
        setMessagesToChat(currentChatID, fetchedMessages);
      }
    };
    fetchAndSetMessages();
  }, [currentChatID, chatIDToMessages, setMessagesToChat]);
  if (!auth || !auth.session) return null;
  return (
    // mystery 64 px is from the navbar
    <div className="flex flex-row  justify-center w-full  h-[calc(100vh-64px)]">
      <ChatSideBar className="px-2  min-w-fit w-1/5" />
      <ChatArea className="flex-1" />
    </div>
  );
}
