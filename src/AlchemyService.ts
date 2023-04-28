import { MAX_ACTIVE, OPTION_COUNT } from './constants';
import { AdviceEffectResult } from './type/advice';
import { ElixirInstance } from './type/elixir';
import { gacha, playRefineSuccessSound } from './util';

class AlchemyService {
  private clean(elixirs: ElixirInstance[]) {
    for (const elixir of elixirs) {
      elixir.hitRate = elixir.nextHitRate;
      elixir.bigHitRate = elixir.nextBigHitRate;
    }
  }

  alchemy(adviceEffectResult: AdviceEffectResult) {
    const { elixirs: beforeElixirs, extraTarget } = adviceEffectResult;
    let delta = 1;
    const result = [...beforeElixirs];
    const targetIndexList = gacha(beforeElixirs, 'hitRate', 1 + extraTarget);
    let before = beforeElixirs.map((elixir) => elixir.level);

    for (let i = 0; i < targetIndexList.length; i++) {
      const idx = targetIndexList[i];
      const randomNumber = Math.random() * 100;
      if (randomNumber <= result[idx].bigHitRate) delta++;
      result[idx].level = Math.min(result[idx].level + delta, MAX_ACTIVE);
    }

    for (let i = 0; i < OPTION_COUNT; i++) {
      const diff = result[i].level - before[i];

      if (diff === 2) {
        result[i].statusText = '연성 대성공';
        playRefineSuccessSound();
      } else if (diff === 1) result[i].statusText = '연성 성공';
      else result[i].statusText = null;
    }

    this.clean(result);

    return result;
  }
}

export const alchemyService = new AlchemyService();
