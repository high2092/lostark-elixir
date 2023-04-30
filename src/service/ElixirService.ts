import { OPTION_COUNT } from '../constants';
import { ELIXIRS } from '../database/elixir';
import { gacha } from '../util';

const DEFAULT_BIG_HIT_RATE_PERCENT = 10;

const hitRate = 100 / OPTION_COUNT;
const bigHitRate = DEFAULT_BIG_HIT_RATE_PERCENT;

class ElixirService {
  elixirs = ELIXIRS.map((elixir, idx) => ({ ...elixir, id: idx, level: 0, locked: false, hitRate, bigHitRate, statusText: null, nextHitRate: hitRate, nextBigHitRate: bigHitRate }));

  drawOptions() {
    const targetIndexList = gacha(this.elixirs, { count: OPTION_COUNT, oddsKey: 'odds' });
    const result = targetIndexList.map((idx) => this.elixirs[idx]);
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

export const elixirService = new ElixirService();
