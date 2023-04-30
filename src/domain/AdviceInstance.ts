import { Placeholders } from '../constants';
import { Advice, AdviceEffect, AdviceType } from '../type/advice';
import { ElixirInstance } from '../type/elixir';

export interface AdviceInstance {
  name: string;
  type: AdviceType;
  execute: AdviceEffect;
}

export function createAdviceInstance(advice: Advice, elixirs: ElixirInstance[], optionIndex: number, subIndex: number): AdviceInstance {
  return {
    name: advice.name.replace(Placeholders.OPTION, elixirs[optionIndex].name).replace(Placeholders.SUB_OPTION, elixirs[subIndex].name),
    type: advice.type,
    execute: advice.effect({ optionIndex, subIndex }),
  };
}
