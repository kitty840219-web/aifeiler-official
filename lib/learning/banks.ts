import {SPELLING_BANK} from "./spelling";
import {CHARACTER_BANK,IDIOM_BANK,SENTENCE_BANK,DIALOGUE_BANK,READING_BANK} from "./languageBanks";
import type {Bank,LearningKind,LevelId,Question} from "./types";
const BANKS:Record<LearningKind,Bank>={spelling:SPELLING_BANK,characters:CHARACTER_BANK,idioms:IDIOM_BANK,sentences:SENTENCE_BANK,dialogue:DIALOGUE_BANK,reading:READING_BANK};
export function questionsFor(kind:LearningKind,level:LevelId):Question[]{return BANKS[kind][level];}
