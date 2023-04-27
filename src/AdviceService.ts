import { ADVICE_COUNT, OPTION_COUNT } from './constants';
import { ADVICES, OPTION_NAME_PLACEHOLDER } from './database/advice';

class AdviceInstance implements IAdviceInstance {
  name: string;
  effect: (before: ElixirInstance[]) => () => ElixirInstance[];
  execute: () => AdviceResult;
  odds: number;

  constructor(advice: Advice, beforeElixirs: ElixirInstance[], parameter: AdviceParameter) {
    const { optionIdx } = parameter;
    const elixir = beforeElixirs[optionIdx];
    this.name = advice.name.replace(OPTION_NAME_PLACEHOLDER, elixir.name);
    this.execute = advice.effect(beforeElixirs, parameter);
  }
}

class AdviceService {
  oddsSum = ADVICES.reduce((acc, { odds }) => {
    return acc + odds;
  }, 0);

  createAdviceInstance(advice: Advice, beforeElixirs: ElixirInstance[]) {
    const idx = Math.floor(Math.random() * OPTION_COUNT);
    return new AdviceInstance(advice, beforeElixirs, { optionIdx: idx });
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

  pickAdvice(advice: IAdviceInstance, parameter: AdviceParameter) {
    const adviceResult = advice.execute();

    const { optionIdx } = parameter;

    if (typeof adviceResult === 'function') {
      if (!optionIdx) return { ok: false, data: advice, statusText: '엘릭서를 선택해주세요.' };
      else {
        return { ok: true, data: adviceResult(optionIdx) };
      }
    } else {
      return { ok: true, data: advice.execute() };
    }
  }
}

export const adviceService = new AdviceService();
