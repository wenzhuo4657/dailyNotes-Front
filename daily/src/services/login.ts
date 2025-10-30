import { getHttp } from "@/lib/http";

export async  function github(){
  const http=getHttp()
  const res=await http.get("/api/oauth/render/github")
  return res.data;
}