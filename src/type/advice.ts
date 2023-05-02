import { ElixirInstance } from './elixir';
import { SageKey, SageTypesType } from './sage';

export interface AdviceBody {
  type: AdviceType;
  special?: SageTypesType;
  sage?: SageKey;
  remainChanceLowerBound?: number;
  remainChanceUpperBound?: number;
  oddsAmplification?: number;
  name: string;
  effect: AdviceEffect;
  odds: number;
  optionIndex?: number;
  subOptionIndex?: number;
  exhaust?: boolean;
}

export interface Advice extends AdviceBody {
  id: number;
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

export type AdviceType = 'potential' | 'util' | 'lock' | 'utillock' | 'unlock';

// 연성 추가 효과
export interface AdviceAfterEffect {
  extraTarget?: number;
  extraAlchemy?: number;
  saveChance?: boolean;
  extraChanceConsume?: number;
}
