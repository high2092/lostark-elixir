import { FullStack, OPTION_COUNT, Placeholders, playRefineFailureSound, playRefineSuccessSound } from './constants';
import { ADVICES } from './database/advice';
import { SageInstance } from './type/sage';
import { calculateOddsSum } from './util';

const N_TABLE = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 5, 5];

class AdviceInstance implements IAdviceInstance {
  name: string;
  type: AdviceType;
  effect: (param: AdviceParam) => AdviceEffect;
  execute: AdviceEffect;
  odds: number;

  constructor(advice: Advice, name: string, optionIndex: number, turn: number) {
    const n = N_TABLE[turn];
    this.name = advice.name
      .replace(Placeholders.OPTION, name)
      .replace(Placeholders.N_NPLUS_1, `[${n}~${n + 1}]`)
      .replace(Placeholders.N, n?.toString());
    this.type = advice.type;
    this.execute = advice.effect({ optionIndex, n });
  }
}

class AdviceService {
  oddsSum = ADVICES.reduce((acc, { odds }) => {
    return acc + odds;
  }, 0);

  createAdviceInstance(advice: Advice, beforeElixirs: ElixirInstance[], turn: number) {
    const idx = Math.floor(Math.random() * OPTION_COUNT);
    return new AdviceInstance(advice, beforeElixirs[idx].name, idx, turn);
  }

  private isFullStack(sage: SageInstance) {
    return sage.stack === FullStack[sage.type];
  }

  private getAdvices(sage: SageInstance) {
    if (this.isFullStack(sage)) {
      sage.stack = 0;
      return ADVICES.filter((advice) => advice.sage === sage.name && advice.special === sage.type);
    }
    return ADVICES.filter((advice) => !advice.special);
  }

  drawAdvices(beforeElixirs: ElixirInstance[], sages: SageInstance[], turn: number): SageInstance[] {
    const _sages = [...sages];

    for (const sage of _sages) {
      const advices = this.getAdvices(sage);
      const randomNumber = Math.random() * calculateOddsSum(advices, 'odds');
      let oddsAcc = 0;
      for (const advice of advices) {
        if (randomNumber <= (oddsAcc += advice.odds)) {
          sage.advice = this.createAdviceInstance(advice, beforeElixirs, turn);
          break;
        }
      }
    }

    return _sages;
  }

  pickAdvice(selectedSageIndex: number, beforeElixirs: ElixirInstance[], sages: SageInstance[], optionIdx: number): PickAdviceReturnType {
    try {
      const { advice } = sages[selectedSageIndex];
      let before = beforeElixirs.map((elixir) => elixir.level);
      const result = advice.execute(beforeElixirs, optionIdx);

      let success = false;

      for (let i = 0; i < OPTION_COUNT; i++) {
        const diff = result[i].level - before[i];
        if (diff > 0) {
          result[i].statusText = '연성 단계 상승';
          success = true;
        } else if (diff < 0) {
          result[i].statusText = '연성 단계 하락';
        } else result[i].statusText = null;
      }

      if (advice.type === 'util' || success) playRefineSuccessSound();
      else playRefineFailureSound();

      for (let i = 0; i < sages.length; i++) {
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

      return { ok: true, data: { elixirs: result, sages: [...sages] }, statusText: null };
    } catch (e) {
      console.error(e);
      return { ok: false, data: { elixirs: beforeElixirs, sages: [...sages] }, statusText: '엘릭서를 선택해주세요.' };
    }
  }
}

interface PickAdviceReturnType {
  ok: boolean;
  data: {
    elixirs: ElixirInstance[];
    sages: SageInstance[];
  };
  statusText: string;
}

export const adviceService = new AdviceService();
