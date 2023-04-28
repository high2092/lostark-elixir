import { Placeholders } from '../constants';
import { Advice, AdviceEffect, AdviceParam, AdviceType } from '../type/advice';

const N_TABLE = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 5, 5];

export class AdviceInstance implements Advice {
  name: string;
  type: AdviceType;
  effect: (param: AdviceParam) => AdviceEffect;
  execute: AdviceEffect;
  odds: number;

  constructor(advice: Advice, name: string, optionIndex: number, turn: number) {
    const n = N_TABLE[turn];
    this.name = advice.name
      .replace(Placeholders.OPTION, name)
      .replace(Placeholders.N_NPLUS_1, `[${n}~${n + 1}]`)
      .replace(Placeholders.N, n?.toString());
    this.type = advice.type;
    this.execute = advice.effect({ optionIndex, n });
  }
}
