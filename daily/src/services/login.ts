import { http } from "@/lib/http";

export async  function github(){
  const res=await http.get("/api/oauth/render/github")
  return res.data;
}