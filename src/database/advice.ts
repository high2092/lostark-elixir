import { MAX_ACTIVE, OPTION_COUNT, Placeholders as P } from '../constants';
import { optionService } from '../service/OptionService';
import { AdviceBody, AdviceType, AdviceUniqueKeys } from '../type/advice';
import { SageKey, SageKeys, SageTypesType, SageTypesTypes } from '../type/sage';
import { applySafeResult, changeHitRate, convertToSignedString, extractOptionDefaultProps, gacha, generateRandomInt, generateRandomNumber, getMaxLevel, getMinLevel, lockOption, redistribute, unlockOption, validateOptionIndex } from '../util';

const getExtraAlchemyText = (extraAlchemy: number) => `이번에 연성되는 효과는 ${1 + extraAlchemy}단계 연성해${P.주겠네}.`;
const getExtraTargetText = (extraTarget: number) => `이번 연성에서 ${extraTarget + 1}개의 효과를 동시에 연성해${P.주겠네}.`;
const getOtherOptionLevelDownText = (n: number, optionName?: string) => `대신 ${optionName ? `${optionName} 효과` : '다른 효과 1개'}의 단계가 ${n} 감소${P.할걸세}.`;

/** TODO: 봉인된 옵션에 대한 처리 방식 조사하기
 * 1. 단계 위/아래로 한칸씩 이동
 * 2. 재분배
 * 3. 뒤섞기
 */

type AdviceTemplate = (odds: number, params: AdviceTemplateProps) => AdviceBody;

const createFixedOptionAdvices = (odds: number, template: AdviceTemplate, params: AdviceTemplateProps) => Array.from({ length: OPTION_COUNT }).map((_, idx) => template(odds, { ...params, optionIndex: idx }));

const createFixedSubOptionAdvices = (odds: number, template: AdviceTemplate, params: AdviceTemplateProps) => {
  const result = [];
  for (let i = 0; i < OPTION_COUNT; i++) {
    for (let j = 0; j < OPTION_COUNT; j++) {
      if (i === j) continue;
      result.push(template(odds, { ...params, optionIndex: i, subOptionIndex: j }));
    }
  }
  return result;
};

export const ADVICES: AdviceBody[] = [
  ...createFixedOptionAdvices(1.5, potentialLevelUpFixedOptionAdviceTemplate, { percentage: 25 }),
  ...createFixedOptionAdvices(0.35, potentialLevelUpFixedOptionAdviceTemplate, { percentage: 50 }),
  potentialLevelSelectedOptionAdviceTemplate(0.8, { percentage: 25 }),
  potentialLevelSelectedOptionAdviceTemplate(0.2, { percentage: 50 }),

  ...createFixedOptionAdvices(1, potentialChangeLevelFixedOptionAdviceTemplate, { maxRisk: 2, maxReturn: 2 }),
  ...createFixedOptionAdvices(0.27, potentialChangeLevelFixedOptionAdviceTemplate, { maxRisk: 1, maxReturn: 2 }),
  potentialChangeLevelSelectedOptionAdviceTemplate(0.6, { maxRisk: 2, maxReturn: 2 }),
  potentialChangeLevelSelectedOptionAdviceTemplate(0.15, { maxRisk: 1, maxReturn: 2 }),

  // 확정 레벨업, 리스크 O
  levelUpHighestOptionAdviceTemplate(0.2, { maxReturn: 1, maxRisk: 2, remainChanceUpperBound: 12 }),
  levelUpLowestOptionAdviceTemplate(0.1, { remainChanceUpperBound: 12 }),
  levelUpRandomOptionAdviceTemplate(1.8, { n: 1 }),
  levelUpSelectedOptionAdviceTemplate(7.225, { n: 1, special: SageTypesTypes.ORDER }),
  levelUpSelectedOptionAdviceTemplate(1.275, { n: 2, special: SageTypesTypes.ORDER }),
  levelUpHighestOptionAdviceTemplate(1.5, { maxReturn: 2, special: SageTypesTypes.ORDER }),

  // 고정 레벨 변경
  raiseAllBelowNAdviceTemplate(0.1, { n: 0, remainChanceUpperBound: 12 }),
  raiseAllBelowNAdviceTemplate(0.2, { n: 2, remainChanceUpperBound: 9 }),
  raiseAllBelowNAdviceTemplate(0.3, { n: 4, remainChanceUpperBound: 6 }),
  raiseAllBelowNAdviceTemplate(0.4, { n: 6, remainChanceUpperBound: 3 }),

  ...createFixedOptionAdvices(0.3, changeFixedOptionToFixedLevelAdviceTemplate, { n: 1, remainChanceUpperBound: 12, remainChanceLowerBound: 10 }),
  ...createFixedOptionAdvices(0.3, changeFixedOptionToFixedLevelAdviceTemplate, { n: 2, remainChanceUpperBound: 9, remainChanceLowerBound: 7 }),
  ...createFixedOptionAdvices(0.3, changeFixedOptionToFixedLevelAdviceTemplate, { n: 3, remainChanceUpperBound: 6, remainChanceLowerBound: 4 }),
  ...createFixedOptionAdvices(0.3, changeFixedOptionToFixedLevelAdviceTemplate, { n: 5, remainChanceUpperBound: 3 }),

  ...createFixedOptionAdvices(0.7, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: 100, name: `이번 연성에서 ${P.OPTION} 효과를 연성해${P.주겠네}.` }),
  ...createFixedOptionAdvices(0.2, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: 70 }),
  ...createFixedOptionAdvices(0.8, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: 35 }),
  ...createFixedOptionAdvices(0.8, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: -20 }),
  ...createFixedOptionAdvices(0.2, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: -40 }),

  ...createFixedOptionAdvices(0.8, amplifyFixedOptionHitRateAdviceTemplate, { percentage: 5 }),
  ...createFixedOptionAdvices(0.2, amplifyFixedOptionHitRateAdviceTemplate, { percentage: 10 }),
  ...createFixedOptionAdvices(0.8, amplifyFixedOptionHitRateAdviceTemplate, { percentage: -5 }),
  ...createFixedOptionAdvices(0.2, amplifyFixedOptionHitRateAdviceTemplate, { percentage: -10 }),

  ...createFixedOptionAdvices(1, amplifyFixedOptionBigHitRateAdviceTemplate, { percentage: 7 }),
  ...createFixedOptionAdvices(0.27, amplifyFixedOptionBigHitRateAdviceTemplate, { percentage: 15 }),
  ...createFixedOptionAdvices(0.7, amplifyFixedOptionBigHitRateTemporarilyAdviceTemplate, { percentage: 100 }),

  amplifySelectedOptionBigHitRateTemporarilyAdviceTemplate(0.4, { percentage: 100 }),
  amplifyAllBigHitRateTemporarilyAdviceTemplate(1.5, { percentage: 30 }),
  amplifyAllBigHitRateTemporarilyAdviceTemplate(0.37, { percentage: 60 }),

  amplifyAllBigHitRateAdviceTemplate(1.5, { percentage: 5 }),
  amplifyAllBigHitRateAdviceTemplate(0.37, { percentage: 10 }),
  amplifyAllBigHitRateAdviceTemplate(2.1, { percentage: 15, special: SageTypesTypes.ORDER }),
  amplifyOddOrEvenBigHitRateAdviceTemplate(4.2, { odd: true, percentage: 15, special: SageTypesTypes.ORDER }),
  amplifyOddOrEvenBigHitRateAdviceTemplate(7.7, { odd: false, percentage: 15, special: SageTypesTypes.ORDER }),
  amplifySelectedOptionBigHitRateAdviceTemplate(6, { percentage: 25, special: SageTypesTypes.ORDER }),

  potentialChangeLevelSelectedOptionAdviceTemplate(15.3846, { maxRisk: 0, maxReturn: 4, special: SageTypesTypes.CHAOS, sage: SageKeys.L, enterMeditation: true }),
  potentialChangeLevelSelectedOptionAdviceTemplate(15.3846, { maxRisk: -2, maxReturn: 3, special: SageTypesTypes.CHAOS, sage: SageKeys.B, enterMeditation: true }),
  potentialChangeLevelSelectedOptionAdviceTemplate(15.3846, { maxRisk: 4, maxReturn: 5, special: SageTypesTypes.CHAOS, sage: SageKeys.C, enterMeditation: true }),

  amplifySelectedHitRateAdviceTemplate(8.5, { percentage: 15, special: SageTypesTypes.ORDER }),
  amplifySelectedHitRateAdviceTemplate(8.5, { percentage: -20, special: SageTypesTypes.ORDER }),

  addRerollChanceAdviceTemplate(14, { addRerollChance: 1, special: SageTypesTypes.ORDER }),
  addRerollChanceAdviceTemplate(6, { addRerollChance: 2, special: SageTypesTypes.ORDER }),

  moveUpLevelAdviceTemplate(6.4103, { special: SageTypesTypes.CHAOS }),
  moveDownLevelAdviceTemplate(6.4103, { special: SageTypesTypes.CHAOS }),

  lockRandomOptionAdviceTemplate(2.5, { remainChanceUpperBound: 13, remainChanceLowerBound: 8 }),
  ...createFixedOptionAdvices(1, lockFixedOptionAdviceTemplate, { type: 'utillock', remainChanceUpperBound: 13, remainChanceLowerBound: 8, extraChanceConsume: 1 }),

  unlockRandomOptionAndLockOtherOptionAdviceTemplate(10.2564),

  ...createFixedOptionAdvices(1, lockFixedOptionAdviceTemplate, {}),
  lockSelectedOptionAdviceTemplate(1, { type: 'utillock', remainChanceUpperBound: 13, remainChanceLowerBound: 8, special: SageTypesTypes.ORDER }),
  lockSelectedOptionAdviceTemplate(33.3333, { saveChance: true, special: SageTypesTypes.ORDER }),
  lockSelectedOptionAdviceTemplate(33.3333, { extraTarget: 1, special: SageTypesTypes.ORDER }),
  lockSelectedOptionAdviceTemplate(33.3333, { extraAlchemy: 1, special: SageTypesTypes.ORDER }),
  lockSelectedOptionAndRedistributeAdviceTemplate(25, { special: SageTypesTypes.CHAOS }),
  lockSelectedOptionAndLevelUpRandomOptionAdviceTemplate(25, { special: SageTypesTypes.CHAOS }),
  lockSelectedOptionAndLevelUpLowestOptionAdviceTemplate(25, { special: SageTypesTypes.CHAOS }),

  redistributeAdviceTemplate(12.8, { special: SageTypesTypes.CHAOS }),
  exchangeOddEvenAdviceTemplate(0.05, { odd: true, n: 1, remainChanceUpperBound: 12 }),
  exchangeOddEvenAdviceTemplate(0.2, { odd: false, n: 1, remainChanceUpperBound: 12 }),
  ...createFixedSubOptionAdvices(0.35, exchangeOneLevelBetweenFixedOptionsAdviceTemplate, { n: 1, remainChanceUpperBound: 12 }),
  ...createFixedSubOptionAdvices(0.2, exchangeLevelBetweenFixedOptionsAdviceTemplate, { remainChanceUpperBound: 12 }),
  ...createFixedSubOptionAdvices(0.35, exchangeLevelBetweenFixedOptionsAdviceTemplate, { n: 1, remainChanceUpperBound: 12 }),
  exchangeLevelBetweenMaxMinAdviceTemplate(0.2, { remainChanceUpperBound: 12 }),
  exchangeLevelBetweenMaxMinAdviceTemplate(0.8, { n: 1, remainChanceUpperBound: 12 }),

  amplifySelectedOptionHitRateTemporarilyAdviceTemplate(0.38, { extraChanceConsume: 1, extraAlchemy: 1, remainChanceUpperBound: 11 }),

  addExtraTargetAdviceTemplate(0.54, { extraTarget: 1, remainChanceUpperBound: 11 }),
  addExtraTargetAdviceTemplate(0.54, { extraTarget: 2, extraChanceConsume: 1, remainChanceUpperBound: 11 }),
  addExtraTargetAdviceTemplate(0.2, { extraTarget: 2, remainChanceUpperBound: 11, special: SageTypesTypes.ORDER }),

  extraAlchemyAdviceTemplate(0.54, { extraAlchemy: 1 }),
  extraAlchemyAdviceTemplate(0.54, { extraAlchemy: 2, extraChanceConsume: 1, remainChanceUpperBound: 11 }),
  amplifySelectedOptionHitRateTemporarilyAdviceTemplate(5, { extraAlchemy: 1, special: SageTypesTypes.ORDER }),
  extraAlchemyAdviceTemplate(1, { extraAlchemy: 2, special: SageTypesTypes.ORDER }),

  saveChanceAdviceTemplate(5),

  changeOptionSelectedSlotAdviceTemplate(10.25),

  discountGoldCostAdviceTemplate(1.14, { percentage: 20 }),
  discountGoldCostAdviceTemplate(0.48, { percentage: 40 }),
  discountGoldCostAdviceTemplate(2.6, { percentage: 100, special: SageTypesTypes.ORDER }),

  resetAdviceTemplate(10.25),

  redistributeSelectedOptionAdvice(2.05),
  redistributeHighestOptionAdvice(4.1),
  redistributeLowestOptionAdvice(4.1),
];

function potentialLevelUpFixedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, optionIndex } = params;
  return {
    name: `${P.OPTION} 효과를 ${percentage}% 확률로 +1 올려${P.주겠네}.`,
    type: 'potential',
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      if (generateRandomNumber(0, 100) <= percentage) applySafeResult(result[optionIndex], { level: result[optionIndex].level + 1 });
      return { options: result };
    },
    odds,
    optionIndex,
    uniqueKey: AdviceUniqueKeys.POTENTIAL_LEVEL_UP + optionIndex,
  };
}

function potentialLevelSelectedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage } = params;
  return {
    name: `선택한 효과를 ${percentage}% 확률로 +1 올려${P.주겠네}.`,
    type: 'potential',
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      if (generateRandomNumber(0, 100) <= percentage) applySafeResult(result[optionIndex], { level: result[optionIndex].level + 1 });
      return { options: result };
    },
    odds,
    uniqueKey: AdviceUniqueKeys.POTENTIAL_LEVEL_UP_SELECTED_OPTION,
  };
}

function potentialChangeLevelFixedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { maxRisk, maxReturn, optionIndex } = params;
  return {
    name: `${P.OPTION} 효과를 [${convertToSignedString(-maxRisk)}~${convertToSignedString(maxReturn)}] 중 하나만큼 올려${P.주겠네}.`,
    type: 'potential',
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const diff = generateRandomInt(-maxRisk, maxReturn + 1);
      applySafeResult(result[optionIndex], { level: result[optionIndex].level + diff });
      return { options: result };
    },
    odds,
    optionIndex,
    uniqueKey: AdviceUniqueKeys.POTENTIAL_CHANGE_LEVEL + optionIndex,
  };
}

function levelUpHighestOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { maxReturn, maxRisk, special, remainChanceUpperBound } = params;
  return {
    name: `최고 단계 효과를 ${maxReturn} 올려${P.주겠네}.${maxRisk ? ` ${getOtherOptionLevelDownText(maxRisk)}` : ''} `,
    type: 'util',
    special,
    contradictMaxLevelExists: true,
    remainChanceUpperBound,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const maxLevel = getMaxLevel(result);
      const [upTargetIndex] = gacha(result, { filterConditions: [(option) => option.level === maxLevel] });
      const [downTargetIndex] = gacha(result, { filterConditions: [(option, idx) => idx !== upTargetIndex] });
      applySafeResult(result[upTargetIndex], { level: result[upTargetIndex].level + maxReturn });
      applySafeResult(result[downTargetIndex], { level: result[downTargetIndex].level - (maxRisk ?? 0) });
      return { options: result };
    },
    odds,
  };
}

function levelUpLowestOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { remainChanceUpperBound } = params;
  return {
    name: `최하 단계 효과를 +1 올려${P.주겠네}. 대신 최고 단계의 효과가 2 감소${P.할걸세}.`,
    type: 'util',
    remainChanceUpperBound,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const minLevel = getMinLevel(result);
      const maxLevel = getMaxLevel(result);
      const [upTargetIndex] = gacha(result, { filterConditions: [(option) => option.level === minLevel] });
      const [downTargetIndex] = gacha(result, { filterConditions: [(option, idx) => idx !== upTargetIndex && option.level === maxLevel] });
      applySafeResult(result[upTargetIndex], { level: result[upTargetIndex].level + 1 });
      applySafeResult(result[downTargetIndex], { level: result[downTargetIndex].level - 2 });
      return { options: result };
    },
    odds,
  };
}

function levelUpSelectedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special, n } = params;
  return {
    name: `${P.자네가} ${P.선택한} 효과의 단계를 ${n} 올려${P.주겠네}.`,
    type: 'util',
    special,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      applySafeResult(result[optionIndex], { level: result[optionIndex].level + n });
      return { options: result };
    },
    odds,
  };
}

function levelUpRandomOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, special } = params;
  return {
    name: `임의 효과를 +${n} 올려${P.주겠네}.`,
    type: 'util',
    special,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const [targetIndex] = gacha(result, { filterConditions: [(option) => option.level < MAX_ACTIVE] });
      applySafeResult(result[targetIndex], { level: result[targetIndex].level + n });
      return { options: result };
    },
    odds,
  };
}

/**
 *
 * @param maxRisk 0 이상의 정수
 * @param maxReturn -maxRisk 이상의 정수
 * @param odds 조언 등장 확률
 * @param props 풀스택 또는 특정 현자인 경우
 * @returns
 */
function potentialChangeLevelSelectedOptionAdviceTemplate(odds: number, props?: AdviceTemplateProps): AdviceBody {
  props ??= {};
  const { special, sage, maxRisk, maxReturn, enterMeditation } = props;
  return {
    name: special
      ? `${P.내} 힘을 모두 소진${P.하겠네}. 대신 ${P.자네가} ${P.선택한} 효과의 단계를 [${convertToSignedString(-maxRisk)}~${convertToSignedString(maxReturn)}] 중 하나만큼 ${P.올릴걸세}.`
      : `선택한 효과를 [${convertToSignedString(-maxRisk)}~${convertToSignedString(maxReturn)}] 중 하나만큼 올려${P.주겠네}.`,
    type: 'potential',
    special,
    sage,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      const diff = generateRandomInt(-maxRisk, maxReturn + 1);
      applySafeResult(result[optionIndex], { level: result[optionIndex].level + diff });
      return { options: result, enterMeditation };
    },
    odds,
    exhaust: enterMeditation,
    uniqueKey: AdviceUniqueKeys.POTENTIAL_CHANGE_LEVEL_SELECTED_OPTION + sage,
  };
}

function amplifyFixedOptionHitRateTemporarilyAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, name, optionIndex } = params;
  return {
    name: name ?? `이번 연성에서 ${P.OPTION} 효과의 연성 확률을 ${Math.abs(percentage)}% ${percentage >= 0 ? '높여' : '낮춰'}${P.주겠네}.`,
    type: 'util',
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      changeHitRate(optionIndex, percentage, result, { temp: true });
      return { options: result };
    },
    odds,
    optionIndex,
    contradictLastOption: true,
    uniqueKey: AdviceUniqueKeys.AMPLIFY_FIXED_OPTION_HIT_RATE_TEMPRORARILY + optionIndex,
  };
}

function amplifySelectedOptionHitRateTemporarilyAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { extraAlchemy, extraChanceConsume, remainChanceUpperBound, special } = params;
  const percentage = 100;
  return {
    name: `이번에는 ${P.자네가} ${P.선택한} 효과를 ${1 + extraAlchemy}단계 연성해${P.주겠네}.${extraChanceConsume ? ` 다만 기회를 ${1 + extraChanceConsume}번 소모${P.할걸세}.` : ''}`,
    type: 'util',
    remainChanceUpperBound,
    special,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      changeHitRate(optionIndex, percentage, result, { temp: true });
      return { options: result, extraAlchemy, extraChanceConsume };
    },
    odds,
    extraChanceConsume,
  };
}

function amplifyFixedOptionHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, optionIndex } = params;
  return {
    name: `남은 연성에서 ${P.OPTION} 효과의 연성 확률을 ${Math.abs(percentage)}% ${percentage >= 0 ? '높여' : '낮춰'}${P.주겠네}.`,
    type: 'util',
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      changeHitRate(optionIndex, percentage, result);
      return { options: result };
    },
    odds,
    optionIndex,
    contradictLastOption: true,
    uniqueKey: AdviceUniqueKeys.AMPLIFY_FIXED_OPTION_HIT_RATE + optionIndex,
  };
}

function amplifySelectedHitRateAdviceTemplate(odds: number, props?: AdviceTemplateProps): AdviceBody {
  props ??= {};
  const { special, sage, percentage } = props;
  return {
    name: `남은 연성에서 선택한 효과의 연성 확률을 ${Math.abs(percentage)}% ${percentage >= 0 ? '높여' : '낮춰'}${P.주겠네}.`,
    type: 'util',
    special,
    sage,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      changeHitRate(optionIndex, percentage, result);
      return { options: result };
    },
    odds,
    contradictLastOption: true,
  };
}

function amplifyFixedOptionBigHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, optionIndex } = params;
  return {
    name: `남은 연성에서 ${P.OPTION} 효과의 대성공 확률을 ${percentage}% 높여${P.주겠네}.`,
    type: 'util',
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      applySafeResult(result[optionIndex], { bigHitRate: result[optionIndex].bigHitRate + percentage });

      return { options: result };
    },
    odds,
    optionIndex,
    uniqueKey: AdviceUniqueKeys.AMPLIFY_FIXED_OPTION_BIG_HIT_RATE + optionIndex,
  };
}

function amplifySelectedOptionBigHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, special } = params;
  return {
    name: `남은 연성에서 선택한 효과의 대성공 확률을 ${percentage}% 높여${P.주겠네}.`,
    type: 'util',
    special,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));

      applySafeResult(result[optionIndex], { bigHitRate: result[optionIndex].bigHitRate + percentage });

      return { options: result };
    },
    odds,
  };
}

function amplifyAllBigHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, special } = params;
  return {
    name: `남은 연성에서 모든 효과의 대성공 확률을 ${percentage}% 높여${P.주겠네}.`,
    type: 'util',
    special,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      result.forEach((option) => applySafeResult(option, { bigHitRate: option.bigHitRate + percentage }));
      return { options: result };
    },
    odds,
    uniqueKey: AdviceUniqueKeys.AMPLIFY_ALL_BIG_HIT_RATE + special,
  };
}

function amplifyFixedOptionBigHitRateTemporarilyAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, optionIndex } = params;
  return {
    name: `이번 연성에서 ${P.OPTION} 효과의 대성공 확률을 ${percentage}% 높여${P.주겠네}.`,
    type: 'util',
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      applySafeResult(result[optionIndex], { tempBigHitRate: result[optionIndex].bigHitRate + percentage });
      return { options: result };
    },
    odds: odds,
    optionIndex,
  };
}

function amplifySelectedOptionBigHitRateTemporarilyAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage } = params;
  return {
    name: `이번 연성에서 선택한 효과의 대성공 확률을 ${percentage}% 높여${P.주겠네}.`,
    type: 'util',
    effect: (options, optionIndex) => {
      const result = options.map((option) => ({ ...option }));
      applySafeResult(result[optionIndex], { tempBigHitRate: result[optionIndex].bigHitRate + percentage });
      return { options: result };
    },
    odds: odds,
  };
}

function amplifyAllBigHitRateTemporarilyAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage } = params;
  return {
    name: `이번 연성에서 모든 효과의 대성공 확률을 ${percentage}% 높여${P.주겠네}.`,
    type: 'util',
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      result.forEach((option) => applySafeResult(option, { tempBigHitRate: option.bigHitRate + percentage }));
      return { options: result };
    },
    odds: odds,
    uniqueKey: AdviceUniqueKeys.AMPLIFY_ALL_BIG_HIT_RATE_TEMPORARILY,
  };
}

function addExtraTargetAdviceTemplate(odds: number, params?: AdviceTemplateProps): AdviceBody {
  params ??= {};
  const { extraTarget, extraChanceConsume, remainChanceUpperBound, special } = params;
  return {
    name: `이번 연성에서 ${extraTarget + 1}개의 효과를 동시에 연성해${P.주겠네}.${extraChanceConsume ? ` 다만, 기회를 ${extraChanceConsume + 1}번 소모${P.할걸세}.` : ''}`,
    type: 'util',
    remainChanceUpperBound,
    effect: (options) => ({ options: options, extraTarget, extraChanceConsume }),
    odds,
    special,
    extraChanceConsume,
    contradictLastOption: true,
  };
}

function addRerollChanceAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { addRerollChance, special } = params;
  return {
    name: `다른 조언 보기 횟수를 ${addRerollChance}회 늘려${P.주겠네}.`,
    type: 'util',
    special,
    effect: (options) => ({ options: options, addRerollChance }),
    odds,
  };
}

function moveUpLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;
  return {
    name: `모든 효과의 단계를 위로 1 슬롯 씩 올려${P.주겠네}.`,
    type: 'util',
    special,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const candidate = result.filter((option) => !option.locked);
      const firstLevel = candidate[0].level;
      for (let i = 0; i < candidate.length - 1; i++) {
        candidate[i].level = candidate[i + 1].level;
      }
      candidate[candidate.length - 1].level = firstLevel;
      return { options: result };
    },
    odds,
  };
}

function moveDownLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;
  return {
    name: `모든 효과의 단계를 아래로 1 슬롯 씩 내려${P.주겠네}.`,
    type: 'util',
    special,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const candidate = result.filter((option) => !option.locked);
      const lastLevel = candidate[candidate.length - 1].level;
      for (let i = candidate.length - 1; i > 0; i--) {
        candidate[i].level = candidate[i - 1].level;
      }
      candidate[0].level = lastLevel;
      return { options: result };
    },
    odds,
  };
}

function lockRandomOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { extraChanceConsume, saveChance, special, remainChanceUpperBound, remainChanceLowerBound } = params;
  return {
    name: `임의의 효과 하나를 봉인${P.하겠네}.${extraChanceConsume ? ` 다만, 기회를 ${1 + extraChanceConsume}번 소모${P.할걸세}.` : ''}${saveChance ? ` 이번 연성은 기회를 소모하지 ${P.않을걸세}.` : ''}`,
    type: 'utillock',
    special,
    remainChanceUpperBound,
    remainChanceLowerBound,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const [idx] = gacha(result);

      lockOption(result, idx);

      return { options: result, saveChance, extraChanceConsume };
    },
    odds,
    extraChanceConsume,
  };
}

function lockFixedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { extraChanceConsume, optionIndex, type, remainChanceUpperBound, remainChanceLowerBound } = params;
  return {
    name: `${P.OPTION} 효과를 봉인${P.하겠네}.${extraChanceConsume ? ` 다만, 이번 연성에서 기회를 ${1 + extraChanceConsume}번 소모${P.할걸세}.` : ''}`,
    type: type ?? 'lock',
    remainChanceUpperBound,
    remainChanceLowerBound,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));

      lockOption(result, optionIndex);

      return { options: result, extraChanceConsume };
    },
    odds,
    optionIndex,
    extraChanceConsume,
  };
}

function lockSelectedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { extraChanceConsume, saveChance, special, extraAlchemy, extraTarget, type, remainChanceLowerBound, remainChanceUpperBound } = params;
  return {
    name: `선택한 효과 하나를 봉인${P.하겠네}.
    ${extraChanceConsume ? ` 다만, 기회를 ${1 + extraChanceConsume}번 소모${P.할걸세}.` : ''}
    ${saveChance ? ` 이번 연성은 기회를 소모하지 ${P.않을걸세}.` : ''}
    ${extraAlchemy ? ` ${getExtraAlchemyText(extraAlchemy)}` : ''}
    ${extraTarget ? ` ${getExtraTargetText(extraTarget)}` : ''}`,
    type: type ?? 'lock',
    special,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));

      lockOption(result, optionIndex);

      return { options: result, saveChance, extraChanceConsume, extraAlchemy, extraTarget };
    },
    remainChanceLowerBound,
    remainChanceUpperBound,
    odds,
    extraChanceConsume,
  };
}

function lockSelectedOptionAndRedistributeAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;
  return {
    name: `선택한 효과를 봉인${P.하겠네}. 그 후 모든 효과의 단계를 재분배${P.하겠네}.`,
    type: 'lock',
    special,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      lockOption(result, optionIndex);
      redistribute(result);
      return { options: result };
    },
    odds,
  };
}

function redistributeSelectedOptionAdvice(odds: number): AdviceBody {
  return {
    name: `선택한 효과의 단계를 모두 다른 효과에 분배${P.하겠네}.`,
    type: 'util',
    special: SageTypesTypes.CHAOS,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      const candidate = result.filter((_, idx) => idx !== optionIndex);
      result[optionIndex].level = 0;
      redistribute(candidate, options[optionIndex].level);
      return { options: result };
    },
    odds,
  };
}

function redistributeLowestOptionAdvice(odds: number): AdviceBody {
  return {
    name: `최하 단계 효과 1개의 단계를 모두 다른 효과에 분배${P.하겠네}.`,
    type: 'util',
    special: SageTypesTypes.CHAOS,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const minLevel = getMinLevel(result);
      const [optionIndex] = gacha(result, { filterConditions: [({ level }) => level === minLevel] });
      const candidate = result.filter((_, idx) => idx !== optionIndex);
      result[optionIndex].level = 0;
      redistribute(candidate, options[optionIndex].level);
      return { options: result };
    },
    odds,
  };
}

function redistributeHighestOptionAdvice(odds: number): AdviceBody {
  return {
    name: `최고 단계 효과 1개의 단계를 모두 다른 효과에 분배${P.하겠네}.`,
    type: 'util',
    special: SageTypesTypes.CHAOS,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const maxLevel = getMaxLevel(result);
      const [optionIndex] = gacha(result, { filterConditions: [({ level }) => level === maxLevel] });
      const candidate = result.filter((_, idx) => idx !== optionIndex);
      result[optionIndex].level = 0;
      redistribute(candidate, options[optionIndex].level);
      return { options: result };
    },
    odds,
  };
}

function lockSelectedOptionAndLevelUpRandomOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;
  return {
    name: `선택한 효과를 봉인${P.하겠네}. 그 후 임의의 효과의 단계를 +1 올려${P.주겠네}.`,
    type: 'lock',
    special,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      lockOption(result, optionIndex);

      const [levelUpTargetIndex] = gacha(result, { filterConditions: [(option) => option.level < MAX_ACTIVE] });
      applySafeResult(result[levelUpTargetIndex], { level: result[levelUpTargetIndex].level + 1 });

      return { options: result };
    },
    odds,
  };
}

function lockSelectedOptionAndLevelUpLowestOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;
  return {
    name: `선택한 효과를 봉인${P.하겠네}. 그 후 최하 단계 효과의 단계를 +1 올려${P.주겠네}.`,
    type: 'lock',
    special,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      lockOption(result, optionIndex);

      const minLevel = getMinLevel(result);
      const candidate = result.filter((option) => option.level === minLevel);
      const [lockTargetIndex] = gacha(candidate);
      applySafeResult(candidate[lockTargetIndex], { level: candidate[lockTargetIndex].level + 1 });

      return { options: result };
    },
    odds,
  };
}

function unlockRandomOptionAndLockOtherOptionAdviceTemplate(odds: number): AdviceBody {
  return {
    name: `임의의 효과 1개의 봉인을 해제하고 다른 효과 1개를 봉인해${P.주겠네}.`,
    type: 'unlock',
    special: SageTypesTypes.CHAOS,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const [unlockTargetIndex] = gacha(result, { locked: true });
      const [lockTargetIndex] = gacha(result);

      unlockOption(result, unlockTargetIndex);
      lockOption(result, lockTargetIndex);

      return { options: result };
    },
    odds,
  };
}

function redistributeAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;

  return {
    name: `모든 효과의 단계를 재분배${P.하겠네}.`,
    type: 'util',
    special,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      redistribute(result);
      return { options: result };
    },
    odds,
  };
}

function raiseAllBelowNAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, remainChanceUpperBound, remainChanceLowerBound } = params;
  return {
    name: `${n === 0 ? '연성되지 않은' : `${n}단계 이하의`} 모든 효과를 +1 올려${P.주겠네}.`,
    type: 'util',
    remainChanceUpperBound,
    remainChanceLowerBound,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const candidate = result.filter((option) => option.level <= n);
      candidate.forEach((option) => {
        applySafeResult(option, { level: option.level + 1 });
      });

      return { options: result };
    },
    odds,
  };
}

function changeFixedOptionToFixedLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, remainChanceUpperBound, remainChanceLowerBound, optionIndex } = params;
  return {
    name: `${P.OPTION} 효과의 단계를 [${n}~${n + 1}] 중 하나로 변경해${P.주겠네}.`,
    type: 'util',
    remainChanceUpperBound,
    remainChanceLowerBound,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      applySafeResult(result[optionIndex], { level: n + generateRandomInt(0, 2) });
      return { options: result };
    },
    odds: odds,
    optionIndex,
    changeLevelLowPoint: n,
  };
}

function changeSelectedOptionToFixedLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, remainChanceUpperBound, remainChanceLowerBound } = params;
  return {
    name: `선택한 효과의 단계를 [${n}~${n + 1}] 중 하나로 변경해${P.주겠네}.`,
    type: 'util',
    remainChanceUpperBound,
    remainChanceLowerBound,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      applySafeResult(result[optionIndex], { level: n + generateRandomInt(0, 2) });
      return { options: result };
    },
    odds,
    changeLevelLowPoint: n,
  };
}

function exchangeOddEvenAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { odd, remainChanceUpperBound } = params;
  const str = ['2, 4', '1, 3, 5'];
  return {
    name: `${str[Number(odd)]} 슬롯의 효과를 +1 올려${P.주겠네}. 대신 ${str[Number(!odd)]} 슬롯의 효과가 2 감소${P.할걸세}.`,
    type: 'util',
    remainChanceUpperBound,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));

      result.forEach((option, idx) => {
        if ((idx % 2 === 0) === odd) applySafeResult(option, { level: option.level + 1 });
        else applySafeResult(option, { level: option.level - 2 });
      });

      return { options: result };
    },
    odds,
  };
}

function amplifyOddOrEvenBigHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { odd, percentage, special } = params;
  const str = ['2, 4', '1, 3, 5'];
  return {
    name: `남은 연성에서 ${str[Number(odd)]} 슬롯의 효과의 대성공 확률을 ${percentage}% 올려${P.주겠네}.`,
    type: 'util',
    special,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const candidate = result.filter((_, idx) => (idx % 2 === 0) === odd);
      candidate.forEach((option) => {
        applySafeResult(option, { bigHitRate: option.bigHitRate + percentage });
      });

      return { options: result };
    },
    odds,
  };
}

function exchangeOneLevelBetweenFixedOptionsAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, optionIndex, subOptionIndex, remainChanceUpperBound } = params;
  return {
    name: `${P.OPTION} 효과의 단계를 +1 올려${P.주겠네}. 대신 ${P.SUB_OPTION} 효과의 단계가 ${n} 감소${P.할걸세}.`,
    type: 'util',
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      applySafeResult(result[optionIndex], { level: result[optionIndex].level + 1 });
      applySafeResult(result[subOptionIndex], { level: result[subOptionIndex].level - n });
      return { options: result };
    },
    odds,
    optionIndex,
    subOptionIndex,
    uniqueKey: AdviceUniqueKeys.EXCHANGE_ONE_LEVEL_BETWEEN_FIXED_OPTIONS + optionIndex + subOptionIndex,
    remainChanceUpperBound,
  };
}

function exchangeLevelBetweenFixedOptionsAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, optionIndex, subOptionIndex, remainChanceUpperBound } = params;
  return {
    name: `${n ? `${P.OPTION} 단계 효과를 ${n} 소모하고 ` : ''}${P.OPTION} 효과와 ${P.SUB_OPTION} 효과의 단계를 뒤바꿔${P.주겠네}.`,
    type: 'util',
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      applySafeResult(result[optionIndex], { level: options[subOptionIndex].level });
      applySafeResult(result[subOptionIndex], { level: options[optionIndex].level - (n ?? 0) });
      return { options: result };
    },
    odds,
    optionIndex,
    subOptionIndex,
    remainChanceUpperBound,
    uniqueKey: AdviceUniqueKeys.EXCHANGE_LEVEL_BETWEEN_FIXED_OPTIONS + optionIndex + subOptionIndex,
  };
}

function exchangeLevelBetweenMaxMinAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, remainChanceUpperBound } = params;
  return {
    name: `${n ? `최고 단계 효과를 ${n} 소모하고 ` : ''}최고 단계 효과 1개와 최하 단계 효과 1개의 단계를 뒤바꿔${P.주겠네}.`,
    type: 'util',
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));
      const maxLevel = getMaxLevel(result);
      const minLevel = getMinLevel(result);
      const [maxTargetIndex] = gacha(result, { filterConditions: [(option) => option.level === maxLevel] });
      const [minTargetIndex] = gacha(result, { filterConditions: [(option, idx) => option.level === minLevel && idx !== maxTargetIndex] });
      applySafeResult(result[maxTargetIndex], { level: options[minTargetIndex].level });
      applySafeResult(result[minTargetIndex], { level: options[maxTargetIndex].level - (n ?? 0) });
      return { options: result };
    },
    odds,
    remainChanceUpperBound,
  };
}

function extraAlchemyAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { extraAlchemy, extraChanceConsume, special, remainChanceUpperBound } = params;
  return {
    name: `${getExtraAlchemyText(extraAlchemy)}${extraChanceConsume ? ` 다만, 기회를 ${extraChanceConsume + 1}번 소모${P.할걸세}.` : ''}`,
    type: 'util',
    remainChanceUpperBound,
    special,
    effect: (options) => ({ options: options, extraAlchemy, extraChanceConsume }),
    odds,
    extraChanceConsume,
  };
}

function saveChanceAdviceTemplate(odds: number): AdviceBody {
  return {
    name: `이번 연성은 기회를 소모하지 ${P.않을걸세}.`,
    type: 'util',
    special: SageTypesTypes.ORDER,
    effect: (options) => ({ options: options, saveChance: true }),
    odds,
  };
}

function changeOptionSelectedSlotAdviceTemplate(odds: number): AdviceBody {
  return {
    name: `${P.자네가} ${P.선택한} 슬롯의 효과를 변경${P.하겠네}. 좋은 결과가 나오길 ${P.바라네}.`,
    type: 'util',
    special: SageTypesTypes.CHAOS,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      const newOption = optionService.exchangeOption(result[optionIndex]);
      result[optionIndex] = {
        ...result[optionIndex],
        ...extractOptionDefaultProps(newOption),
      };

      return { options: result };
    },
    odds,
  };
}

function discountGoldCostAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, special } = params;
  return {
    name: `남은 연성에서 비용이 ${percentage}% 감소${P.할걸세}.`,
    type: 'util',
    special,
    discount: true,
    effect: (options) => ({ options, discount: percentage }),
    odds,
    uniqueKey: AdviceUniqueKeys.DISCOUNT_GOLD_COST,
  };
}

function resetAdviceTemplate(odds: number): AdviceBody {
  return {
    name: `${P.흐름이좋지않군}. 엘릭서의 효과와 단계를 초기화${P.하겠네2}.`,
    type: 'util',
    special: SageTypesTypes.CHAOS,
    effect: (options) => ({ options, reset: true }),
    odds,
  };
}

// 디버깅 전용
function fillAdviceTemplate(odds: number): AdviceBody {
  return {
    name: `선택한 효과의 단계를 10으로 변경해${P.주겠네}.`,
    type: 'util',
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));
      applySafeResult(result[optionIndex], { level: 10 });
      return { options: result };
    },
    odds,
  };
}

interface AdviceTemplateProps {
  name?: string;

  special?: SageTypesType;
  sage?: SageKey;
  remainChanceLowerBound?: number;
  remainChanceUpperBound?: number;

  percentage?: number;
  n?: number;
  addRerollChance?: number;
  saveChance?: boolean;
  maxRisk?: number;
  maxReturn?: number;
  extraTarget?: number;
  extraAlchemy?: number;
  extraChanceConsume?: number;

  enterMeditation?: boolean;

  odd?: boolean; // exchange 1 level between 1, 3, 5 <-> 2, 4

  optionIndex?: number;
  subOptionIndex?: number;

  type?: AdviceType;
}
