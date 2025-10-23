

export interface DailyItem {
    id: number;
    title: string;
    content: string;
    expand?:string;
   

}

export interface ChecklistItem extends DailyItem{
     editing?: boolean
}