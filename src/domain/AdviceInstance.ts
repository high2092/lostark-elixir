import { Placeholders } from '../constants';
import { Advice, AdviceEffect, AdviceParam, AdviceType } from '../type/advice';
import { ElixirInstance } from '../type/elixir';

export class AdviceInstance implements Advice {
  name: string;
  type: AdviceType;
  effect: (param: AdviceParam) => AdviceEffect;
  execute: AdviceEffect;
  odds: number;

  constructor(advice: Advice, elixirs: ElixirInstance[], optionIndex: number, subIndex: number) {
    const name = elixirs[optionIndex].name;
    const subName = elixirs[subIndex].name;
    this.name = advice.name.replace(Placeholders.OPTION, name).replace(Placeholders.SUB_OPTION, subName);
    this.type = advice.type;
    this.execute = advice.effect({ optionIndex, subIndex });
  }
}
