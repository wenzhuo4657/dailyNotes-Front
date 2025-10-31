import { getHttp } from "@/lib/http";
import { QueryItemDto } from "@/type/requestDto/QueryItemDto";
import { UpdateItemDto } from "@/type/requestDto/UpdateItemDto";
import { InsertItemDto } from "@/type/requestDto/InsertItemDto";
import { UpdateCheckListDto } from "@/type/requestDto/UpdateCheckListDto";
import { ref } from "vue";










export async  function getMdByType(data:QueryItemDto){
  const http=getHttp()
  const res=await http.post("/api/item/get",data,{
    headers: {
    Accept: "application/json",
    },
     responseType: "json"
  })

 
  return res.data;
}

export async function addItem() {
  const http=getHttp()
  const payload: InsertItemDto = { contentNameId: 0, type: 0 };
  return addItemByType(payload);
}

export async function getMd() {
  const http=getHttp()
  return getMdByType({ contentNameId: 0, type: 0 });
}

export async function  updateItemByType(data:UpdateItemDto) {

  const http=getHttp()

  const res=await http.post("/api/item/update",data,{
    
    responseType: "text"
  })
  return !!res.data;
  
}






export async function addItemByType(data:InsertItemDto) {
  const http=getHttp()
  const res=await http.post("/api/item/insert",data,{

    responseType: "text"
  })
  return !!res.data;
  
}






export async function  DownLoadFile(){
  const http=getHttp()
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
  const http=getHttp()
  const progress = ref(0);
  const res=await http.post("api/upload",data,  
      {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress(evt) {
        if (evt.total) {
          progress.value = Math.round((evt.loaded / evt.total) * 100);
        }
      }
})
   return !!res.data ;
  
}






export async function updateCheckListTitle(data:UpdateCheckListDto){
  const http=getHttp()
    const res=await http.post("/api/item/field/checklist/title",data,{
    responseType: "text"
  })
  return !!res.data;


}


export async function updateCheckListStatus(data:number){
  const http=getHttp()
    let url="/api/item/field/checklist/finish"
    url+="?id="+data
    const res=await http.post(url,{

    responseType: "text"
     })
  return !!res.data;


}

export async function getAllTypes() {
  const http = getHttp();
  const url = "/api/types/getAllTypes";
  const res = await http.get(url);
  return res.data;
}

export async function getTypesWithItems(data:number) {
    const http=getHttp()
    let url="/api/types/getContentIdsByTypes"
    url+="?id="+data
    const res=await http.get(url)
    return res.data;

  
}
