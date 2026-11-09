import {SPELLING_BANK} from "./spelling";
import type {LearningKind,LevelId,Question} from "./types";
export function questionsFor(kind:LearningKind,level:LevelId):Question[]{return kind==="spelling"?SPELLING_BANK[level]:[];}
