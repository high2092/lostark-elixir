import { MAX_ACTIVE } from '../constants';
import { AdviceAfterEffect } from '../type/advice';
import { ElixirInstance } from '../type/elixir';
import { gacha, playRefineSuccessSound } from '../util';

class AlchemyService {
  alchemy(elixirs: ElixirInstance[], adviceAfterResult: AdviceAfterEffect) {
    const { extraTarget, extraAlchemy } = adviceAfterResult;
    const delta = 1 + (extraAlchemy ?? 0);
    const result = [...elixirs];
    const targetIndexList = gacha(elixirs, { oddsKey: 'hitRate', count: 1 + (extraTarget ?? 0) });

    let bigHit = false;
    for (const idx of targetIndexList) {
      const randomNumber = Math.random() * 100;
      const bonus = Number(randomNumber <= result[idx].bigHitRate);
      if (bonus) {
        bigHit = true;
        result[idx].statusText = '연성 대성공';
      } else result[idx].statusText = '연성 성공';
      result[idx] = { ...result[idx], level: Math.min(result[idx].level + delta + bonus, MAX_ACTIVE) };
    }

    result.forEach((option, idx) => {
      result[idx] = { ...option, hitRate: option.nextHitRate, bigHitRate: option.nextBigHitRate };
    });

    if (bigHit) playRefineSuccessSound();

    return result;
  }
}

export const alchemyService = new AlchemyService();
