import { ElixirInstance } from '../type/elixir';
import { SageTemplate, SageTypesType } from '../type/sage';
import { AdviceInstance } from './AdviceInstance';

export interface Sage {
  name: string;
  type: SageTypesType;
  dialogueEnds: { [key: string]: string };
  stack: number;
  advice: AdviceInstance;
  elixir: ElixirInstance;
  meditation: boolean;
}

export function createSage(template: SageTemplate): Sage {
  return {
    name: template.name,
    type: null,
    dialogueEnds: template.dialogueEnds,
    stack: 0,
    advice: null,
    elixir: null,
    meditation: false,
  };
}
