import type {LevelId,LearningKind,Subject} from "./types";
export const LEVELS:{id:LevelId;label:string;age:string;focus:string}[]=[
 {id:"p1",label:"小學低年級",age:"約6–8歲",focus:"常用字、字母拼讀與生活短句"},
 {id:"p2",label:"小學中年級",age:"約8–10歲",focus:"部件辨識、常見成語與基本句型"},
 {id:"p3",label:"小學高年級",age:"約10–12歲",focus:"字詞應用、連接詞與短文理解"},
 {id:"junior",label:"國中",age:"約12–15歲",focus:"語境辨義、基礎時態與閱讀線索"},
 {id:"senior",label:"高中",age:"約15–18歲",focus:"成語辨析、字根詞綴與複句"},
 {id:"college",label:"大學／進階",age:"約18歲以上",focus:"精準用詞、學術情境與文章推論"},
];
export const LEARNING_GAMES:{id:LearningKind;title:string;tag:string;description:string;subjects:Subject[];art:number;scene:string;ready:boolean}[]=[
 {id:"spelling",title:"單字拼拼樂",tag:"聽音・字母拼字",description:"聽一聽、點字母，把單字一塊塊拼出來。",subjects:["en"],art:0,scene:"memory",ready:true},
 {id:"characters",title:"小艾文字王",tag:"組字・字形辨識",description:"從部件組字到用字辨析，找回漢字的線索。",subjects:["zh"],art:1,scene:"tiles",ready:false},
 {id:"idioms",title:"成語故事屋",tag:"情境・成語應用",description:"走進小艾的故事，選出最貼切的成語。",subjects:["zh"],art:2,scene:"garden",ready:false},
 {id:"sentences",title:"句子排排站",tag:"英文・詞塊排序",description:"點選詞塊，讓每一句話找到自己的位置。",subjects:["en"],art:3,scene:"solitaire",ready:false},
 {id:"dialogue",title:"情境對話闖關",tag:"英文・生活對話",description:"從打招呼到校園簡報，練習合適的回應。",subjects:["en"],art:4,scene:"island",ready:false},
 {id:"reading",title:"雙語閱讀尋寶",tag:"國文英文・閱讀理解",description:"從短文裡找線索，讀懂文字沒有直接說的事。",subjects:["zh","en"],art:5,scene:"half-moon",ready:false},
];
