import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { useTagStore } from "@/stores/useTagStore";
import { useEffect, useState } from "react";
import { LuBrain } from "react-icons/lu";
import { deleteChatTag, insertChatTag } from "@/app/(api)/chat-services";
import { useChatStore } from "@/stores/useChatStore";
import TagDisplay from "../../mystuff/_components/TagDisplay";

export default function ManageChatSources() {
  const currentChat = useChatStore((state) => state.getCurrentChat());
  const tags = useTagStore((state) => state.tags);
  const [tagSearch, setTagSearch] = useState("");
  const addChatTag = useChatStore((state) => state.addChatTag);
  const removeChatTag = useChatStore((state) => state.removeChatTag);
  const chatTags = useChatStore((state) => state.chatTags);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (tags) {
      setFilteredTags(
        tags.filter((tag) =>
          tag.tag_name.toLowerCase().includes(tagSearch.trim().toLowerCase())
        )
      );
    }
  }, [tagSearch, tags]);

  const handleAddTag = async (tag: Tag) => {
    if (!currentChat) return;
    if (chatTags?.some((chatTag) => chatTag.tag_id === tag.id)) {
      const deletedChatTag = await deleteChatTag(currentChat.id, tag.id);
      removeChatTag(deletedChatTag);
    } else {
      const newChatTag = await insertChatTag(currentChat.id, tag.id);
      addChatTag(newChatTag);
    }
  };

  if (!tags) return null;
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant={"ghost"} size={"icon"} className="!rounded-full">
            <LuBrain className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Manage {currentChat?.chat_name || "New Chat"} Sources
            </DialogTitle>
            <DialogDescription>
              Add or remove sources from your chat.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search tags"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="!ring-0 !outline-none"
            />
            <div className="flex flex-col h-40 max-h-40 !overflow-y-scroll rounded-md ">
              {filteredTags.map((tag) => {
                const isAdded = chatTags?.some(
                  (chatTag) => chatTag.tag_id === tag.id
                );
                return (
                  <div
                    key={tag.id}
                    className={`hover:cursor-pointer p-2 flex items-center align-middle ${
                      isAdded ? "bg-accent" : ""
                    }`}
                    onClick={() => handleAddTag(tag)}
                  >
                    <TagDisplay tag={tag} />
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
