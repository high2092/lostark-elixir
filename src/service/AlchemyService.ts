import { MAX_ACTIVE } from '../constants';
import { AdviceAfterEffect } from '../type/advice';
import { ElixirInstance } from '../type/elixir';
import { checkMaxLevel, gacha, generateRandomNumber, getBigHitRate, playRefineSuccessSound } from '../util';

class AlchemyService {
  alchemy(elixirs: ElixirInstance[], adviceAfterResult: AdviceAfterEffect) {
    const { extraTarget, extraAlchemy } = adviceAfterResult;
    const delta = 1 + (extraAlchemy ?? 0);
    const result = [...elixirs];
    const oddsKey = result[0].tempHitRate !== null ? 'tempHitRate' : 'hitRate';

    const targetIndexList = gacha(elixirs, { oddsKey, count: 1 + (extraTarget ?? 0) });

    let bigHit = false;
    for (const idx of targetIndexList) {
      const randomBigHitRate = generateRandomNumber(0, 100);
      const bonus = Number(randomBigHitRate <= getBigHitRate(result[idx]));
      if (bonus) {
        bigHit = true;
        result[idx].statusText = '연성 대성공';
      } else result[idx].statusText = '연성 성공';
      result[idx] = { ...result[idx], level: Math.min(result[idx].level + delta + bonus, MAX_ACTIVE) };
    }

    result.forEach((option, idx) => (result[idx] = { ...option, tempHitRate: null, tempBigHitRate: null }));
    checkMaxLevel(result);

    if (bigHit) playRefineSuccessSound();

    return result;
  }
}

export const alchemyService = new AlchemyService();
