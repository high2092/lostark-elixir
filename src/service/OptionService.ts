import { OPTION_COUNT } from '../constants';
import { OPTIONS } from '../database/option';
import { OptionInstance } from '../type/option';
import { createOptionInstanceBody, gacha } from '../util';

class OptionService {
  options: OptionInstance[] = OPTIONS.map((option, idx) => ({ ...createOptionInstanceBody(option), id: idx }));

  reset() {
    this.options = OPTIONS.map((option, idx) => ({ ...createOptionInstanceBody(option), id: idx }));
  }

  drawOptions() {
    const targetIndexList = gacha(this.options, { count: OPTION_COUNT, oddsKey: 'odds' });
    const result = targetIndexList.map((idx) => this.options[idx]);
    return result;
  }

  pickOption(id: number) {
    const idx = this.options.findIndex((option) => option.id === id);
    if (idx === -1) throw new Error('CPU.pickOption: could not find id');
    const [option] = this.options.splice(idx, 1);
    const { part } = option;
    if (part) this.options = this.options.filter((option) => option.part !== part);
    return option;
  }

  /** warning
   *
   * @param id 임의의 값을 넣을 경우 추후 문제가 발생할 수 있음
   */
  exchangeOption(option: OptionInstance) {
    const [idx] = gacha(this.options); // 균등 확률
    this.options.push({ ...createOptionInstanceBody(option), id: option.id });
    return this.pickOption(this.options[idx].id);
  }
}

export const optionService = new OptionService();
