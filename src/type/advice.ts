import { ElixirInstance } from './elixir';
import { SageKey, SageTypesType } from './sage';

export interface Advice {
  type: AdviceType;
  special?: SageTypesType;
  sage?: SageKey;
  remainChanceLowerBound?: number;
  remainChanceUpperBound?: number;
  oddsAmplification?: number;
  name: string;
  effect: (param?: AdviceParam) => AdviceEffect;
  odds: number;
}

export interface AdviceEffectResult {
  elixirs: ElixirInstance[];
  extraTarget?: number;
  extraAlchemy?: number;
  saveChance?: boolean;
  extraChanceConsume?: number;
  addRerollChance?: number;
  reset?: boolean;
  enterMeditation?: boolean;
}

export type AdviceEffect = (beforeElixirs: ElixirInstance[], optionIdx?: number) => AdviceEffectResult;

export interface AdviceParam {
  optionIndex: number;
  subIndex: number;
}

export type AdviceType = 'potential' | 'util';

// 연성 추가 효과
export interface AdviceAfterEffect {
  extraTarget?: number;
  extraAlchemy?: number;
  saveChance?: boolean;
  extraChanceConsume?: number;
}
