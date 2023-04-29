import { Placeholders } from '../constants';
import { Advice, AdviceEffect, AdviceParam, AdviceType } from '../type/advice';

const N_TABLE = [6, 6, 4, 4, 4, 4, 2, 2, 2, 2, 0, 0, 0, 0];
const NPLUS1_TABLE = [5, 5, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1];

export class AdviceInstance implements Advice {
  name: string;
  type: AdviceType;
  effect: (param: AdviceParam) => AdviceEffect;
  execute: AdviceEffect;
  odds: number;

  constructor(advice: Advice, name: string, optionIndex: number, remainChance: number) {
    const n = N_TABLE[remainChance];
    const nPlus1 = NPLUS1_TABLE[remainChance];
    this.name = advice.name
      .replace(Placeholders.OPTION, name)
      .replace(Placeholders.N, n.toString())
      .replace(Placeholders.N_NPLUS_1, `[${nPlus1 - 1}~${nPlus1}]`);
    this.type = advice.type;
    this.execute = advice.effect({ optionIndex, n, nPlus1 });
  }
}
