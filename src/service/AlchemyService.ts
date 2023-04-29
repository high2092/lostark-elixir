import { MAX_ACTIVE, OPTION_COUNT } from '../constants';
import { AdviceEffectResult } from '../type/advice';
import { ElixirInstance } from '../type/elixir';
import { applyAdvice, gacha, playRefineSuccessSound } from '../util';

class AlchemyService {
  private clean(elixirs: ElixirInstance[]) {
    for (const elixir of elixirs) {
      elixir.hitRate = elixir.nextHitRate;
      elixir.bigHitRate = elixir.nextBigHitRate;
    }
  }

  alchemy(adviceEffectResult: AdviceEffectResult) {
    const { elixirs: beforeElixirs, extraTarget, extraAlchemy } = adviceEffectResult;
    let delta = 1 + (extraAlchemy ?? 0);
    const result = [...beforeElixirs];
    const targetIndexList = gacha(beforeElixirs, { oddsKey: 'hitRate', count: 1 + (extraTarget ?? 0) });
    let before = beforeElixirs.map((elixir) => elixir.level);

    for (let i = 0; i < targetIndexList.length; i++) {
      const idx = targetIndexList[i];
      const randomNumber = Math.random() * 100;
      let bonus = Number(randomNumber <= result[idx].bigHitRate);
      applyAdvice(result[idx], { level: result[idx].level + delta + bonus });
    }

    for (let i = 0; i < OPTION_COUNT; i++) {
      const diff = result[i].level - before[i];

      if (diff === delta + 1) {
        result[i].statusText = '연성 대성공';
        playRefineSuccessSound();
      } else if (diff === delta) result[i].statusText = '연성 성공';
      else result[i].statusText = null;
    }

    this.clean(result);

    return result;
  }
}

export const alchemyService = new AlchemyService();
