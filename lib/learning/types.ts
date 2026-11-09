export type LevelId="p1"|"p2"|"p3"|"junior"|"senior"|"college";
export type LearningKind="spelling"|"characters"|"idioms"|"sentences"|"dialogue"|"reading";
export type Subject="zh"|"en";
export type Question={id:string;kind:"choice"|"tokens";lang:Subject;prompt:string;correct:string;options?:string[];solutions?:string[][];tiles?:string[];hint:string;explanation:string;passage?:string;speech?:string;example?:string;exampleZh?:string};
export type Bank=Record<LevelId,Question[]>;
