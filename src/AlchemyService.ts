import { MAX_ACTIVE, OPTION_COUNT, playRefineSuccessSound } from './constants';

class AlchemyService {
  alchemy(beforeElixirs: ElixirInstance[]) {
    let delta = 1;
    const result = [...beforeElixirs];
    const idx = Math.floor(Math.random() * OPTION_COUNT);

    let before = beforeElixirs.map((elixir) => elixir.level);
    const randomNumber = Math.random() * 100;
    if (randomNumber <= result[idx].bigHitRate) delta++;
    result[idx].level = Math.min(result[idx].level + delta, MAX_ACTIVE);

    for (let i = 0; i < OPTION_COUNT; i++) {
      const diff = result[i].level - before[i];

      if (diff === 2) {
        result[i].statusText = '연성 대성공';
        playRefineSuccessSound();
      } else if (diff === 1) result[i].statusText = '연성 성공';
      else result[i].statusText = null;
    }

    return result;
  }
}

export const alchemyService = new AlchemyService();
