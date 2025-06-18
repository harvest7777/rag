import { supabase } from "@/lib/supabase/supabase";

export const createTag = async (
  userUUID: string,
  tagName: string,
  tagColor: Colors
): Promise<Tag> => {
  const { data, error } = await supabase
    .from("tags")
    .insert([{ uuid: userUUID, tag_name: tagName, tag_color: tagColor }])
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") {
      throw new Error(`"${tagName}" already exists`);
    }
  }
  return data as Tag;
};

export const getTags = async (userUUID: string): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("uuid", userUUID);
  if (error) {
    throw new Error(error.message);
  }
  return data as Tag[];
};
