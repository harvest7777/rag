import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatState {
  currentChatID: number | null;
  chats: Chat[] | null;
  chatIDToMessages: Record<number, Message[] | null>;
  lastValidated: number | null;
  hasHydrated: boolean;
}
interface ChatActions {
  addChat: (chat: Chat) => void;
  updateChat: (updatedChat: Chat) => void;
  setChats: (chats: Chat[] | null) => void;
  deleteChat: (chatID: number) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setMessagesToChat: (chatID: number, messages: Message[] | null) => void;
  addMessageToChat: (chatID: number, message: Message) => void;
  setLastValidated: (timestamp: number | null) => void;
  setCurrentChatID: (chatID: number | null) => void;
  setChatIDToMessages: (messages: Record<number, Message[] | null>) => void;
  updateLastMessageContent: (chatID: number, content: string) => void;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: null,
      currentChatID: null,
      hasHydrated: false,
      chatIDToMessages: {},
      lastValidated: null,
      addChat: (chat: Chat) =>
        set((state) => ({
          chats: [...(state.chats || []), chat],
        })),
      setChats: (chats: Chat[] | null) => set({ chats }),
      updateChat: (updatedChat: Chat) =>
        set((state) => ({
          chats: state.chats
            ? state.chats.map((c) =>
                c.id === updatedChat.id ? updatedChat : c
              )
            : null,
        })),
      deleteChat: (chatID: number) => {
        /* When we delete a chat we must remove its messages, update current chat if
        deleted chat was the one we are on*/
        const currentMessages = get().chatIDToMessages;
        // remove chatid from key
        const { [chatID]: _, ...remainingMessages } = currentMessages;
        set((state) => ({
          chats: state.chats
            ? state.chats.filter((c) => c.id !== chatID)
            : null,
          chatIDToMessages: remainingMessages,
          currentChatID:
            state.currentChatID === chatID ? null : state.currentChatID,
        }));
      },
      addMessageToChat: (chatID: number, message: Message) =>
        set((state) => ({
          chatIDToMessages: {
            ...state.chatIDToMessages,
            [chatID]: [...(state.chatIDToMessages[chatID] || []), message],
          },
        })),
      setMessagesToChat: (chatID: number, messages: Message[] | null) =>
        set((state) => ({
          chatIDToMessages: {
            ...state.chatIDToMessages,
            [chatID]: messages,
          },
        })),
      setCurrentChatID: (chatID: number | null) =>
        set({ currentChatID: chatID }),
      setChatIDToMessages: (messages: Record<number, Message[] | null>) =>
        set({ chatIDToMessages: messages }),
      updateLastMessageContent: (chatID: number, content: string) =>
        set((state) => ({
          chatIDToMessages: {
            ...state.chatIDToMessages,
            [chatID]: state.chatIDToMessages[chatID]
              ? state.chatIDToMessages[chatID]!.map((msg, index) =>
                  index === state.chatIDToMessages[chatID]!.length - 1
                    ? { ...msg, message_content: content }
                    : msg
                )
              : null,
          },
        })),
      setLastValidated: (timestamp: number | null) =>
        set({ lastValidated: timestamp }),
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
    }),
    {
      name: "chat-store",
      onRehydrateStorage: () => (state) => {
        const now = Date.now();
        const maxAge = 1000 * 60 * 60 * 24; // 24 hours
        // const maxAge = 1;
        if (!state?.lastValidated || now - state.lastValidated > maxAge) {
          console.log("Cache is stale, resetting store");
          // Cache is stale — clear all
          state?.setChats(null);
          state?.setCurrentChatID(null);
          state?.setChatIDToMessages({}); // clear messages
          // optionally reset chatIDToMessages or other parts
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
