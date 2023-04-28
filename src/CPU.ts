import { ADVICE_COUNT, OPTION_COUNT } from './constants';
import { ELIXIRS } from './database/elixir';
import { ElixirInstance } from './type/elixir';

const DEFAULT_BIG_HIT_RATE_PERCENT = 10;

class CPU {
  elixirs: ElixirInstance[];
  oddsSum = ELIXIRS.reduce((acc, { odds }) => {
    return acc + odds;
  }, 0);

  init() {
    this.elixirs = ELIXIRS.map((elixir, idx) => {
      const hitRate = 100 / OPTION_COUNT;
      const bigHitRate = DEFAULT_BIG_HIT_RATE_PERCENT;
      return { ...elixir, id: idx, level: 0, locked: false, hitRate, bigHitRate, statusText: null, nextHitRate: hitRate, nextBigHitRate: bigHitRate };
    });
  }

  drawOptions(count?: number) {
    count ??= ADVICE_COUNT;

    const elixirs = [...this.elixirs]; // deep copy
    const result = [];

    while (result.length < count) {
      const randomNumber = Math.random() * this.oddsSum;
      let oddsAcc = 0;
      for (let i = 0; i < elixirs.length; i++) {
        const elixir = elixirs[i];
        if (randomNumber <= (oddsAcc += elixir.odds)) {
          result.push(elixir);
          elixirs.splice(i, 1);
          break;
        }
      }
    }

    return result;
  }

  pickOption(id: number) {
    const idx = this.elixirs.findIndex((elixir) => elixir.id === id);
    if (idx === null) throw new Error('CPU.pickOption: could not find id');
    const [elixir] = this.elixirs.splice(idx, 1);
    const { part } = elixir;
    if (part) this.elixirs = this.elixirs.filter((elixir) => elixir.part !== part);
    return elixir;
  }
}

export const cpu = new CPU();
