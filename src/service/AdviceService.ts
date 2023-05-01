import { ADVICES } from '../database/advice';
import { Advice, AdviceInstance } from '../type/advice';
import { ElixirInstance } from '../type/elixir';
import { Sage } from '../type/sage';
import { createAdviceInstance, gacha, isFullStack, playRefineFailureSound, playRefineSuccessSound } from '../util';

class AdviceService {
  advices: Advice[] = ADVICES.map((advice, idx) => ({ ...advice, id: idx + 1 }));

  private getAdvicePool(sage: Sage) {
    if (isFullStack(sage)) return this.advices.filter((advice) => advice.special === sage.type && (advice.sage === sage.name || !advice.sage));
    return this.advices.filter((advice) => !advice.special);
  }

  private createAdviceInstance(advice: Advice, elixirs: ElixirInstance[], currentAdvices: AdviceInstance[]) {
    const [idx, subIdx] = gacha(elixirs, { count: 2, filterConditions: [(elixir: ElixirInstance, idx) => currentAdvices.find((currentAdvice) => (currentAdvice.adviceId === advice.id && currentAdvice.optionIndex) === idx) === undefined] });
    return createAdviceInstance(advice, elixirs, idx, subIdx);
  }

  private getAdvice(sage: Sage, elixirs: ElixirInstance[], remainChance: number, currentAdvices: AdviceInstance[]) {
    const advicePool = this.getAdvicePool(sage);
    const filterConditions = [
      (advice: Advice) => (!advice.remainChanceLowerBound || remainChance >= advice.remainChanceLowerBound) && (!advice.remainChanceUpperBound || remainChance <= advice.remainChanceUpperBound),
      (advice: Advice) => currentAdvices.find((currentAdvice) => currentAdvice.adviceId === advice.id) === undefined,
      (advice: Advice) => sage.advice?.adviceId !== advice.id,
    ];
    const [adviceIndex] = gacha(advicePool, {
      oddsKey: 'odds',
      filterConditions,
    });
    return this.createAdviceInstance(advicePool[adviceIndex], elixirs, currentAdvices);
  }

  getAdvices(sages: Sage[], elixirs: ElixirInstance[], remainChance: number) {
    const result = [];
    sages.forEach((sage) => {
      result.push(this.getAdvice(sage, elixirs, remainChance, result));
    });
    return result;
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
