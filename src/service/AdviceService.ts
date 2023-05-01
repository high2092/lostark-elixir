import { ADVICES } from '../database/advice';
import { AdviceBody, AdviceInstance } from '../type/advice';
import { ElixirInstance } from '../type/elixir';
import { Sage } from '../type/sage';
import { createAdviceInstance, gacha, isFullStack, playRefineFailureSound, playRefineSuccessSound } from '../util';

class AdviceService {
  private getAdvicePool(sage: Sage) {
    if (isFullStack(sage)) return ADVICES.filter((advice) => advice.special === sage.type && (advice.sage === sage.name || !advice.sage));
    return ADVICES.filter((advice) => !advice.special);
  }

  private createAdviceInstance(advice: AdviceBody, elixirs: ElixirInstance[]) {
    const [idx, subIdx] = gacha(elixirs, { count: 2 });
    return createAdviceInstance(advice, elixirs, idx, subIdx);
  }

  private getAdvice(sage: Sage, elixirs: ElixirInstance[], remainChance: number) {
    const advicePool = this.getAdvicePool(sage);
    const [adviceIndex] = gacha(advicePool, {
      oddsKey: 'odds',
      filterConditions: [(advice: AdviceBody) => (!advice.remainChanceLowerBound || remainChance >= advice.remainChanceLowerBound) && (!advice.remainChanceUpperBound || remainChance <= advice.remainChanceUpperBound)],
    });
    return this.createAdviceInstance(advicePool[adviceIndex], elixirs);
  }

  getAdvices(sages: Sage[], elixirs: ElixirInstance[], remainChance: number) {
    return sages.map((sage) => this.getAdvice(sage, elixirs, remainChance));
  }

  executeAdvice(advice: AdviceInstance, elixirs: ElixirInstance[], selectedOptionIndex: number) {
    const result = advice.execute(elixirs, selectedOptionIndex);

    result.elixirs.forEach((elixir, i) => {
      const diff = elixir.level - elixirs[i].level;
      if (diff > 0) elixir.statusText = '연성 단계 상승';
      else if (diff < 0) elixir.statusText = '연성 단계 하락';
    });

    const levelUp = result.elixirs.reduce((acc, cur, i) => acc || cur.level - elixirs[i].level > 0, false);
    if (advice.type === 'util' || levelUp) playRefineSuccessSound();
    else playRefineFailureSound();

    return result;
  }
}

export const adviceService = new AdviceService();
