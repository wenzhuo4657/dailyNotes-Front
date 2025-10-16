import { http } from "@/lib/http";





export async  function getMd(){

  const res= await http.get(
    "/api/md",
    {
      headers: {      
      Accept: "application/json",
      },
       responseType: "json"
    }
  )
 
  return res.data;
}

export async function  updateItem(data) {
  const res=await http.put("/api/md",data,{
    responseType: "text"
  })
  return !!res.data;
  
}

export async function addItem(data) {
  const res=await http.post("/api/md",data,{
    responseType: "text"
  })
  return !!res.data;
  
}


