export interface SageTemplate {
  name: string;
  dialogueEnds: { [key: string]: string };
}

export interface Sage {
  name: string;
  dialogueEnds: { [key: string]: string };
  stack: number;
  advice: IAdviceInstance;
}

export const SageTypesTypes = {
  ORDER: 'order',
  CHAOS: 'chaos',
} as const;

export type SageTypesType = (typeof SageTypesTypes)[keyof typeof SageTypesTypes];

export interface SageInstance extends Sage {
  type?: SageTypesType;
  stack: number;
  advice: IAdviceInstance;
}
