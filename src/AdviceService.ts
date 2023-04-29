import { OPTION_COUNT, Placeholders, SageTypes } from './constants';
import { ADVICES } from './database/advice';
import { AdviceInstance } from './domain/AdviceInstance';
import { Sage } from './domain/Sage';
import { Advice, AdviceEffectResult } from './type/advice';
import { ElixirInstance } from './type/elixir';
import { calculateOddsSum, gacha, isFullStack, playRefineFailureSound, playRefineSuccessSound } from './util';

class AdviceService {
  oddsSum = ADVICES.reduce((acc, { odds }) => {
    return acc + odds;
  }, 0);

  createAdviceInstance(advice: Advice, beforeElixirs: ElixirInstance[], remainChance: number) {
    const [idx] = gacha(beforeElixirs);
    return new AdviceInstance(advice, beforeElixirs[idx].name, idx, remainChance);
  }

  private getAdvices(sage: Sage) {
    if (isFullStack(sage)) {
      return ADVICES.filter((advice) => advice.special === sage.type && (advice.sage === sage.name || !advice.sage));
    }
    return ADVICES.filter((advice) => !advice.special);
  }

  drawAdvices(beforeElixirs: ElixirInstance[], sages: Sage[], remainChance: number): Sage[] {
    const _sages = [...sages];

    for (const sage of _sages) {
      const advices = this.getAdvices(sage).filter((advice) => (!advice.remainChanceLowerBound || remainChance >= advice.remainChanceLowerBound) && (!advice.remainChanceUpperBound || remainChance <= advice.remainChanceUpperBound));
      const randomNumber = Math.random() * calculateOddsSum(advices, 'odds');
      let oddsAcc = 0;
      for (const advice of advices) {
        if (randomNumber <= (oddsAcc += advice.odds)) {
          sage.advice = this.createAdviceInstance(advice, beforeElixirs, remainChance);
          break;
        }
      }
    }

    return _sages;
  }

  pickAdvice(selectedSageIndex: number, beforeElixirs: ElixirInstance[], sages: Sage[], optionIdx: number): PickAdviceReturnType {
    try {
      const { advice } = sages[selectedSageIndex];
      let before = beforeElixirs.map((elixir) => elixir.level);
      const adviceEffectResult = advice.execute(beforeElixirs, optionIdx);
      const { elixirs } = adviceEffectResult;

      let success = false;

      for (let i = 0; i < OPTION_COUNT; i++) {
        const diff = elixirs[i].level - before[i];
        if (diff > 0) {
          elixirs[i].statusText = '연성 단계 상승';
          success = true;
        } else if (diff < 0) {
          elixirs[i].statusText = '연성 단계 하락';
        } else elixirs[i].statusText = null;
      }

      if (advice.type === 'util' || success) playRefineSuccessSound();
      else playRefineFailureSound();

      for (let i = 0; i < sages.length; i++) {
        if (isFullStack(sages[i])) sages[i].stack = 0;
        if (selectedSageIndex === i) {
          if (sages[i].type !== 'order') {
            sages[i].type = 'order';
            sages[i].stack = 0;
          }
          sages[i].stack++;
        } else {
          if (sages[i].type !== 'chaos') {
            sages[i].type = 'chaos';
            sages[i].stack = 0;
          }
          sages[i].stack++;
        }
      }

      return { ok: true, result: adviceEffectResult, sages, statusText: null };
    } catch (e) {
      console.error(e);
      return { ok: false, statusText: '엘릭서를 선택해주세요.' };
    }
  }
}

interface PickAdviceReturnType {
  ok: boolean;
  result?: AdviceEffectResult;
  sages?: Sage[];
  statusText: string;
}

export const adviceService = new AdviceService();
