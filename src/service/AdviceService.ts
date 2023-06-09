import { FINAL_OPTION_COUNT, MAX_ACTIVE, OPTION_COUNT } from '../constants';
import { ADVICES } from '../database/advice';
import { Advice } from '../type/advice';
import { OptionInstance } from '../type/option';
import { Sage } from '../type/sage';
import { checkMaxLevel, gacha, getLockedCount, getLockedOrMaxLevelCount, getMaxLevel, getMinLevel, isContradict, isExist, isFullStack, playRefineFailureSound, playRefineSuccessSound, replaceOptionPlaceholder, requireLock } from '../util';

class AdviceService {
  advices: Advice[] = ADVICES.map((advice, idx) => ({ ...advice, id: idx + 1 }));

  reset() {
    this.advices = ADVICES.map((advice, idx) => ({ ...advice, id: idx + 1 }));
  }

  private getAdvicePool(sage: Sage) {
    if (isFullStack(sage)) return this.advices.filter((advice) => advice.special === sage.type && (advice.sage === sage.name || !advice.sage));
    return this.advices.filter((advice) => !advice.special);
  }

  private getAdvice(sage: Sage, options: OptionInstance[], remainChance: number, currentAdvices: Advice[], someoneMeditation: boolean, discountRate: number) {
    const advicePool = this.getAdvicePool(sage);
    const lockedCount = getLockedCount(options);
    const isLastOption = OPTION_COUNT - getLockedOrMaxLevelCount(options) === 1;

    const minLevel = getMinLevel(options);
    const maxLevel = getMaxLevel(options);

    const filterConditions = [
      (advice: Advice) => (!advice.remainChanceLowerBound || remainChance >= advice.remainChanceLowerBound) && (!advice.remainChanceUpperBound || remainChance <= advice.remainChanceUpperBound),
      (advice: Advice) => currentAdvices.find((currentAdvice) => currentAdvice.id === advice.id) === undefined, // 다른 현자와 같은 조언 X
      (advice: Advice) => sage.advice?.id !== advice.id, // 직전 조언과 같은 조언 X
      (advice: Advice) => !options[advice.optionIndex]?.locked && !options[advice.subOptionIndex]?.locked, // 잠긴 옵션과 관련된 조언 X
      ({ extraChanceConsume, type }: Advice) => {
        if (requireLock({ remainChance, lockedCount, extraChanceConsume, adviceType: type })) return type === 'lock';
        else return type !== 'lock';
      },
      (advice: Advice) => !options[advice.optionIndex]?.isMaxLevel || advice.type === 'utillock' || advice.type === 'lock', // 최대 활성도 옵션 강화 조언 등장 X
      (advice: Advice) => !advice.changeLevelLowPoint || (isExist(advice.optionIndex) ? options[advice.optionIndex].level : minLevel) <= advice.changeLevelLowPoint,
      (advice: Advice) => 1 + (advice.extraChanceConsume ?? 0) <= remainChance, // 남은 연성 횟수보다 많은 기회를 소모하는 조언 등장 X

      (advice: Advice) => !advice.extraChanceConsume || remainChance >= 3, // 남은 연성 횟수가 3회 이하일 때 기회 소모 조언 등장 X
      (advice: Advice) => !advice.contradictMaxLevelExists || maxLevel !== MAX_ACTIVE, // 옵션 중 최고 레벨이 있는 경우 등장 X

      (advice: Advice) => !advice.discount || discountRate < 100,

      (advice: Advice) => !advice.contradictLastOption || !isLastOption,

      (advice: Advice) => !isContradict(currentAdvices, advice.uniqueKey),
    ];

    if (lockedCount === 0) filterConditions.push((advice: Advice) => advice.type !== 'unlock'); // 봉인된 옵션 없는 경우 봉인 해제 조언 등장 X

    if (someoneMeditation) filterConditions.push((advice: Advice) => !advice.exhaust); // 소진 조언 1회 제한

    if (OPTION_COUNT - lockedCount === FINAL_OPTION_COUNT) filterConditions.push((advice) => advice.type !== 'utillock'); // 이미 최종 옵션을 제외하고 모두 봉인된 경우 유틸 봉인 조언 등장 X

    const [adviceIndex] = gacha(advicePool, {
      oddsKey: 'odds',
      filterConditions,
    });

    if (adviceIndex === undefined) throw new Error();

    const result = { ...advicePool[adviceIndex] };
    replaceOptionPlaceholder(result, options);

    return result;
  }

  getAdvices(sages: Sage[], options: OptionInstance[], remainChance: number, discountRate: number) {
    const someoneMeditation = sages.reduce((acc, cur) => acc || cur.meditation, false);

    const TRY = remainChance <= OPTION_COUNT - FINAL_OPTION_COUNT ? 1000 : 1; // 봉인 턴이면 시행 횟수 늘리기
    for (let i = 0; i < TRY; i++) {
      try {
        const result = [];
        sages.forEach((sage) => {
          result.push(this.getAdvice(sage, options, remainChance, result, someoneMeditation, discountRate));
        });
        return result;
      } catch {}
    }
  }

  executeAdvice(advice: Advice, options: OptionInstance[], selectedOptionIndex: number) {
    const result = advice.effect(options, selectedOptionIndex);

    result.options.forEach((option, i) => {
      const diff = option.level - options[i].level;
      if (diff > 0) option.statusText = '연성 단계 상승';
      else if (diff < 0) option.statusText = '연성 단계 하락';
    });

    checkMaxLevel(result.options);

    return result;
  }
}

export const adviceService = new AdviceService();
