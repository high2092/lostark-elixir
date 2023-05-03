import { OPTION_COUNT } from '../constants';
import { ELIXIRS } from '../database/elixir';
import { ElixirInstance } from '../type/elixir';
import { createElixirInstanceBody, gacha } from '../util';

class ElixirService {
  elixirs: ElixirInstance[] = ELIXIRS.map((elixir, idx) => ({ ...createElixirInstanceBody(elixir), id: idx }));

  reset() {
    this.elixirs = ELIXIRS.map((elixir, idx) => ({ ...createElixirInstanceBody(elixir), id: idx }));
  }

  drawOptions() {
    const targetIndexList = gacha(this.elixirs, { count: OPTION_COUNT, oddsKey: 'odds' });
    const result = targetIndexList.map((idx) => this.elixirs[idx]);
    return result;
  }

  pickOption(id: number) {
    const idx = this.elixirs.findIndex((elixir) => elixir.id === id);
    if (idx === -1) throw new Error('CPU.pickOption: could not find id');
    const [elixir] = this.elixirs.splice(idx, 1);
    const { part } = elixir;
    if (part) this.elixirs = this.elixirs.filter((elixir) => elixir.part !== part);
    return elixir;
  }

  /** warning
   *
   * @param id 임의의 값을 넣을 경우 추후 문제가 발생할 수 있음
   */
  exchangeOption(elixir: ElixirInstance) {
    const [idx] = gacha(this.elixirs); // 균등 확률
    this.elixirs.push({ ...createElixirInstanceBody(elixir), id: elixir.id });
    return this.pickOption(this.elixirs[idx].id);
  }
}

export const elixirService = new ElixirService();
