import { ElixirInstance } from './elixir';
import { SageKey, SageTypesType } from './sage';

export interface Advice {
  type: AdviceType;
  special?: SageTypesType;
  sage?: SageKey;
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
}

export type AdviceEffect = (beforeElixirs: ElixirInstance[], optionIdx?: number) => AdviceEffectResult;

export interface AdviceParam {
  optionIndex?: number;
  n?: number;
}

export type AdviceType = 'potential' | 'util';
