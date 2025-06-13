import { supabase } from "@/lib/supabase/supabase";

export const getSillyBucks = async (): Promise<number> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("sillybucks")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (data === null) {
    return -1; // or handle the case where no data is found
  }
  return data.sillybucks;
};
