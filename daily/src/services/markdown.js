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



export async function  DownLoadFile(){
  const res=await http.get("api/DownLoadFile",{
    responseType: 'blob',
    headers :{
      'Content-Type': 'multipart/form-data'
    }
  })

  try{
    const blob = new Blob([res.data]); // 可根据后端设置的 Content-Type 指定类型
    const cd = res.headers['content-disposition'];
    const filename =  'download.db';

    // 生成临时链接并触发下载
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }catch(err){
    alert('下载失败，请稍后重试');
  }
} 


export async function  upload(data) {
  const res=http.post("api/upload",data,  
      {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress(evt) {
        if (evt.total) {
          progress.value = Math.round((evt.loaded / evt.total) * 100);
        }
      }
})
   return !!res.da;
  
}




