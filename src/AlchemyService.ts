import { MAX_ACTIVE, OPTION_COUNT } from './constants';

class AlchemyService {
  alchemy(beforeElixirs: ElixirInstance[]) {
    let diff = 1;
    const result = [...beforeElixirs];
    const idx = Math.floor(Math.random() * OPTION_COUNT);
    const randomNumber = Math.random() * 100;
    if (randomNumber <= result[idx].bigHitRate) diff++;
    result[idx].level = Math.min(result[idx].level + diff, MAX_ACTIVE);
  }
}

export const alchemyService = new AlchemyService();
