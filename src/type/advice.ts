import { OptionInstance } from './option';
import { SageKey, SageTypesType } from './sage';

export const AdviceUniqueKeys = {
  POTENTIAL_LEVEL_UP: 'potentialLevelUp',
  POTENTIAL_LEVEL_UP_SELECTED_OPTION: 'potentialLevelUpSelectedOption',
  POTENTIAL_CHANGE_LEVEL: 'potentialChangeLevel',
  POTENTIAL_CHANGE_LEVEL_SELECTED_OPTION: 'potentialChangeLevelSelectedOption',
  AMPLIFY_FIXED_OPTION_HIT_RATE: 'amplifyFixedOptionHitRate',
  AMPLIFY_FIXED_OPTION_HIT_RATE_TEMPRORARILY: 'amplifyFixedOptionHitRateTemporarily',
  AMPLIFY_FIXED_OPTION_BIG_HIT_RATE: 'amplifyFixedOptionBigHitRate',
  AMPLIFY_FIXED_OPTION_BIG_HIT_RATE_TEMPRORARILY: 'amplifyFixedOptionBigHitRateTemporarily',
  AMPLIFY_ALL_BIG_HIT_RATE: 'amplifyAllBigHitRate',
  DISCOUNT_GOLD_COST: 'discountGoldCost',
  EXCHANGE_ONE_LEVEL_BETWEEN_FIXED_OPTIONS: 'exchangeOneLevelBetweenFixedOptions',
  EXCHANGE_LEVEL_BETWEEN_FIXED_OPTIONS: 'exchangeOneLevelBetweenFixedOptions',
} as const;

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
  extraChanceConsume?: number;
  changeLevelLowPoint?: number;
  contradictMaxLevelExists?: boolean;
  discount?: boolean;
  contradictLastOption?: boolean;
  uniqueKey?: string;
}

export interface Advice extends AdviceBody {
  id: number;
}

export interface AdviceEffectResult {
  options: OptionInstance[];
  extraTarget?: number;
  extraAlchemy?: number;
  saveChance?: boolean;
  extraChanceConsume?: number;
  addRerollChance?: number;
  reset?: boolean;
  enterMeditation?: boolean;
  discount?: number;
}

export type AdviceEffect = (options: OptionInstance[], optionIdx?: number) => AdviceEffectResult;

export type AdviceType = 'potential' | 'util' | 'lock' | 'utillock' | 'unlock';

// 추가 효과
export interface AdviceAfterEffect {
  extraTarget?: number;
  extraAlchemy?: number;
  saveChance?: boolean;
  extraChanceConsume?: number;
  reset?: boolean;
}
