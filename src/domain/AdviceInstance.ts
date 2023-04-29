import { Placeholders } from '../constants';
import { Advice, AdviceEffect, AdviceParam, AdviceType } from '../type/advice';

export class AdviceInstance implements Advice {
  name: string;
  type: AdviceType;
  effect: (param: AdviceParam) => AdviceEffect;
  execute: AdviceEffect;
  odds: number;

  constructor(advice: Advice, name: string, optionIndex: number) {
    this.name = advice.name.replace(Placeholders.OPTION, name);
    this.type = advice.type;
    this.execute = advice.effect({ optionIndex });
  }
}
