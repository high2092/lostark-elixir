import { MAX_ACTIVE } from '../constants';
import { AdviceAfterEffect } from '../type/advice';
import { AlchemyResult, OptionInstance } from '../type/option';
import { checkMaxLevel, gacha, generateRandomNumber, getBigHitRate, playRefineSuccessSound } from '../util';

const getOddsKey = (options: OptionInstance[]): 'tempHitRate' | 'hitRate' => {
  for (const { tempHitRate } of options) {
    if (tempHitRate !== null) return 'tempHitRate';
  }
  return 'hitRate';
};

class AlchemyService {
  alchemy(options: OptionInstance[], adviceAfterResult: AdviceAfterEffect): AlchemyResult {
    const { extraTarget, extraAlchemy } = adviceAfterResult;
    const delta = 1 + (extraAlchemy ?? 0);
    const result = options.map((option) => ({ ...option }));
    const oddsKey = getOddsKey(options);

    const targetIndexList = gacha(options, { oddsKey, count: 1 + (extraTarget ?? 0) });

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

    return { options: result, bigHit };
  }
}

export const alchemyService = new AlchemyService();
