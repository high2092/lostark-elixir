import { AdviceInstance } from '../domain/AdviceInstance';

export interface SageTemplate {
  name: string;
  dialogueEnds: { [key: string]: string };
}

export interface Sage {
  name: string;
  dialogueEnds: { [key: string]: string };
  stack: number;
  advice: AdviceInstance;
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
