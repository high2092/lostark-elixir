import { ADVICE_COUNT, OPTION_COUNT } from './constants';
import { ADVICES, OPTION_NAME_PLACEHOLDER } from './database/advice';

class AdviceInstance implements IAdviceInstance {
  name: string;
  effect: (optionIdx?: number) => AdviceEffect;
  execute: AdviceEffect;
  odds: number;

  constructor(advice: Advice, name: string, optionIdx: number) {
    this.name = advice.name.replace(OPTION_NAME_PLACEHOLDER, name);
    this.execute = advice.effect(optionIdx);
  }
}

class AdviceService {
  oddsSum = ADVICES.reduce((acc, { odds }) => {
    return acc + odds;
  }, 0);

  createAdviceInstance(advice: Advice, beforeElixirs: ElixirInstance[]) {
    const idx = Math.floor(Math.random() * OPTION_COUNT);
    return new AdviceInstance(advice, beforeElixirs[idx].name, idx);
  }

  drawAdvices(beforeElixirs: ElixirInstance[]) {
    const result: AdviceInstance[] = [];

    // TODO: 완전히 동일한 조언 중복 제거
    while (result.length < ADVICE_COUNT) {
      const randomNumber = Math.random() * this.oddsSum;
      let oddsAcc = 0;
      for (let i = 0; i < ADVICES.length; i++) {
        const advice = ADVICES[i];
        if (randomNumber <= (oddsAcc += advice.odds)) {
          result.push(this.createAdviceInstance(advice, beforeElixirs));
          break;
        }
      }
    }

    return result;
  }

  pickAdvice(advice: IAdviceInstance, beforeElixirs: ElixirInstance[], optionIdx: number) {
    try {
      return { ok: true, data: advice.execute(beforeElixirs, optionIdx) };
    } catch {
      return { ok: false, data: advice, statusText: '엘릭서를 선택해주세요.' };
    }
  }
}

export const adviceService = new AdviceService();
