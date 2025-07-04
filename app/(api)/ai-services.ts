import { supabase } from "@/lib/supabase/supabase";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function embedFile(sessionToken: string) {
  const { data, error } = await supabase.functions.invoke("embed", {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  if (error) {
    console.error("Error embedding file:", error);
    throw new Error("Failed to embed file");
  }
  console.log(data);
  return data;
}

export async function testAPI(sessionToken: string) {
  const response = await fetch(`${apiUrl}/embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionToken,
    },
    body: JSON.stringify({ file_uuid: "a537da55-75af-45e0-8e15-9ccf3391a372" }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch test API");
  }
  const data = await response.json();
  console.log(data);
  return data;
}

export async function testQuery(sessionToken: string) {
  const response = await fetch(`${apiUrl}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionToken,
    },
    body: JSON.stringify({ query: "What is DIA?" }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch test API");
  }
  const data = await response.json();
  console.log(data);
  return data;
}

export async function deleteTest(
  sessionToken: string,
  uuid: string,
  fileName: string
) {
  const baseApi = "https://dinhdxubgeoecqjislpg.supabase.co/storage/v1";
  const response = await fetch(
    `${baseApi}/object/user-files/${uuid}/${fileName}.pdf`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  console.log(response);
}

export async function supabaseDelete(sessionToken: string, fileName: string) {
  const { data, error } = await supabase.functions.invoke(
    "delete-from-storage",
    {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ file_name: fileName }),
    }
  );
  if (error) {
    console.error(error);
  }
  console.log(data);
  return data;
}
