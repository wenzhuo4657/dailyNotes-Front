import { http } from "@/lib/http";

export async function getMarkdown() {
  const res = await http.get("/api/md", {
    headers: { Accept: "text/markdown; charset=UTF-8" },
    responseType: "text",
  });
  return res.data; 
}

export async function saveMarkdown(md) {
  const res = await http.put("/api/md", md, {
    headers: {
      "Content-Type": "text/markdown; charset=UTF-8",
      Accept: "application/json",
    },
    transformRequest: [(data) => data],
  });

  return !!res.data;
}
