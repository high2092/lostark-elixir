import { FINAL_OPTION_COUNT, OPTION_COUNT } from '../constants';
import { ADVICES } from '../database/advice';
import { Advice } from '../type/advice';
import { ElixirInstance } from '../type/elixir';
import { Sage } from '../type/sage';
import { checkMaxLevel, gacha, getLockedCount, isFullStack, playRefineFailureSound, playRefineSuccessSound, recalculateHitRate, replaceOptionPlaceholder } from '../util';

class AdviceService {
  advices: Advice[] = ADVICES.map((advice, idx) => ({ ...advice, id: idx + 1 }));

  reset() {
    this.advices = ADVICES.map((advice, idx) => ({ ...advice, id: idx + 1 }));
  }

  private getAdvicePool(sage: Sage) {
    if (isFullStack(sage)) return this.advices.filter((advice) => advice.special === sage.type && (advice.sage === sage.name || !advice.sage));
    return this.advices.filter((advice) => !advice.special);
  }

  private getAdvice(sage: Sage, elixirs: ElixirInstance[], remainChance: number, currentAdvices: Advice[], someoneMeditation: boolean) {
    const advicePool = this.getAdvicePool(sage);

    const filterConditions = [
      (advice: Advice) => (!advice.remainChanceLowerBound || remainChance >= advice.remainChanceLowerBound) && (!advice.remainChanceUpperBound || remainChance <= advice.remainChanceUpperBound),
      (advice: Advice) => currentAdvices.find((currentAdvice) => currentAdvice.id === advice.id) === undefined, // 다른 현자와 같은 조언 X
      (advice: Advice) => sage.advice?.id !== advice.id, // 직전 조언과 같은 조언 X
      (advice: Advice) => !elixirs[advice.optionIndex]?.locked && !elixirs[advice.subOptionIndex]?.locked, // 잠긴 옵션과 관련된 조언 X
    ];

    const lockedCount = getLockedCount(elixirs);

    if (lockedCount === 0) filterConditions.push((advice: Advice) => advice.type !== 'unlock'); // 봉인된 옵션 없는 경우 봉인 해제 조언 등장 X

    if (remainChance <= OPTION_COUNT - FINAL_OPTION_COUNT - lockedCount) filterConditions.push((advice: Advice) => advice.type === 'lock');
    else filterConditions.push((advice: Advice) => advice.type !== 'lock');

    if (someoneMeditation) filterConditions.push((advice: Advice) => !advice.exhaust); // 소진 조언 1회 제한

    if (OPTION_COUNT - lockedCount === FINAL_OPTION_COUNT) filterConditions.push((advice) => advice.type !== 'utillock');

    const [adviceIndex] = gacha(advicePool, {
      oddsKey: 'odds',
      filterConditions,
    });

    const result = { ...advicePool[adviceIndex] };
    replaceOptionPlaceholder(result, elixirs);

    return result;
  }

  getAdvices(sages: Sage[], elixirs: ElixirInstance[], remainChance: number) {
    const someoneMeditation = sages.reduce((acc, cur) => acc || cur.meditation, false);

    const TRY = remainChance <= OPTION_COUNT - FINAL_OPTION_COUNT ? 1000 : 1; // 봉인 턴이면 시행 횟수 늘리기
    for (let i = 0; i < TRY; i++) {
      try {
        const result = [];
        sages.forEach((sage) => {
          result.push(this.getAdvice(sage, elixirs, remainChance, result, someoneMeditation));
        });
        return result;
      } catch {}
    }
  }

  executeAdvice(advice: Advice, elixirs: ElixirInstance[], selectedOptionIndex: number) {
    const result = advice.effect(elixirs, selectedOptionIndex);

    result.elixirs.forEach((elixir, i) => {
      const diff = elixir.level - elixirs[i].level;
      if (diff > 0) elixir.statusText = '연성 단계 상승';
      else if (diff < 0) elixir.statusText = '연성 단계 하락';
    });

    const levelUp = result.elixirs.reduce((acc, cur, i) => acc || cur.level - elixirs[i].level > 0, false);

    checkMaxLevel(result.elixirs);
    recalculateHitRate(result.elixirs);

    if (advice.type !== 'potential' || levelUp) playRefineSuccessSound();
    else playRefineFailureSound();

    return result;
  }
}

export const adviceService = new AdviceService();
