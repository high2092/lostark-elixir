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

export type SageType = 'order' | 'chaos';

export interface SageInstance extends Sage {
  type?: SageType;
  stack: number;
  advice: IAdviceInstance;
}
