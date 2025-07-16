import { supabase } from "@/lib/supabase/supabase";

export const createChat = async (
  ownerUUID: string,
  chatName: string
): Promise<Chat> => {
  const { data, error } = await supabase
    .from("chats")
    .insert({
      owner_uuid: ownerUUID,
      chat_name: chatName,
    })
    .select("*")
    .single();
  if (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
  return data;
};

export const getChats = async (): Promise<Chat[]> => {
  const { data, error } = await supabase.from("chats").select("*");
  if (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
  return data;
};

export const insertMessage = async (
  message_content: string,
  role: "user" | "assistant", 
  chat_id: number
): Promise<Message> => {
  // This should only be used to send messages as a user.
  const { data, error } = await supabase
    .from("messages")
    .insert({
      message_content: message_content,
      chat_id: chat_id,
      role: role,
    })
    .select("*")
    .single();
  if (error) {
    console.error("Error creating message:", error);
    throw error;
  }
  return data;
};

export const deleteChat = async (chatID: number): Promise<Chat> => {
  const { data, error } = await supabase
    .from("chats")
    .delete()
    .eq("id", chatID)
    .select("*")
    .single();
  if (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
  return data;
};

export const getMessagesForChat = async (
  chatID: number
): Promise<Message[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatID)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Error fetching messages for chat:", error);
    throw error;
  }
  return data;
};

export const renameChat = async (
  chatID: number,
  newName: string
): Promise<Chat> => {
  const { data, error } = await supabase
    .from("chats")
    .update({ chat_name: newName })
    .eq("id", chatID)
    .select("*")
    .single();
  if (error) {
    console.error("Error renaming chat:", error);
    throw error;
  }
  return data;
};

export const updateMessageContent = async (messageId: number, newContent: string): Promise<Message> => {
  const {data, error} = await supabase
  .from("messages")
  .update({"message_content": newContent})
  .eq("id", messageId)
  .select("*")
  .single();

  if (error) {
    console.error("Error updating message content:", error);
    throw error;
  }
  return data;
}

export const fetchChatTags = async(): Promise<ChatTag[]> => {
  const {data, error} = await supabase
  .from("chat_tags")
  .select("*");
  if (error) {
    console.error("Error fetching chat tags:", error);
    throw error;
  }
  return data;
}

export const insertChatTag = async (chat_id: number, tag_id: number): Promise<ChatTag> => {
  const {data, error} = await supabase
  .from("chat_tags")
  .insert({
    chat_id: chat_id,
    tag_id: tag_id,
  })
  .select("*")
  .single();
  if (error) {
    console.error("Error inserting chat tag:", error);
    throw error;
  }
  return data;
}

export const deleteChatTag = async (chat_id: number, tag_id: number): Promise<ChatTag> => {
  const {data, error} = await supabase
  .from("chat_tags")
  .delete()
  .eq("chat_id", chat_id)
  .eq("tag_id", tag_id)
  .select("*")
  .single();
  if (error) {
    console.error("Error deleting chat tag:", error);
    throw error;
  }
  return data;
}