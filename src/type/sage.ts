import { Advice } from './advice';
import { ElixirInstance } from './elixir';

export interface SageTemplate {
  name: string;
  dialogueEnds: DialogueEnds;
}

export const SageTypesTypes = {
  ORDER: 'order',
  CHAOS: 'chaos',
} as const;

export type SageTypesType = (typeof SageTypesTypes)[keyof typeof SageTypesTypes];

export const SageKeys = {
  L: '루베도',
  B: '비르디타스',
  C: '치트리니',
} as const;

export type SageKey = (typeof SageKeys)[keyof typeof SageKeys];

export interface Sage {
  name: string;
  type: SageTypesType;
  dialogueEnds: { [key: string]: string };
  stack: number;
  viewStack: {
    type: SageTypesType;
    stack: number;
  };
  advice: Advice;
  elixir: ElixirInstance;
  meditation: boolean;
}

export const DialogueEndTypes = {
  어떤가: '어떤가',
  주겠네: '주겠네',
  올릴걸세: '올릴걸세',
  내: '내',
  하겠네: '하겠네',
  자네가: '자네가',
  선택한: '선택한',
  할걸세: '할걸세',
  않을걸세: '않을걸세',
} as const;

export type DialogueEndTypes = (typeof DialogueEndTypes)[keyof typeof DialogueEndTypes];

type DialogueEnds = {
  [key in DialogueEndTypes]: string;
};
