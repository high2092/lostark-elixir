import { ELIXIRS } from './database/elixir';

const ADVICE_COUNT = 3;

class CPU {
  elixirs: ElixirInstance[];
  oddsSum = ELIXIRS.reduce((acc, { odds }) => {
    return acc + odds;
  }, 0);

  init() {
    this.elixirs = ELIXIRS.map((elixir, idx) => ({ ...elixir, id: idx }));
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
    return this.elixirs.splice(idx, 1);
  }
}

export const cpu = new CPU();
