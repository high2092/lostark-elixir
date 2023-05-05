import { OPTION_COUNT, Placeholders as P } from '../constants';
import { optionService } from '../service/OptionService';
import { AdviceBody, AdviceType } from '../type/advice';
import { SageKey, SageKeys, SageTypesType, SageTypesTypes } from '../type/sage';
import { applySafeResult, changeHitRate, convertToSignedString, extractOptionDefaultProps, gacha, generateRandomInt, generateRandomNumber, getMaxLevel, getMinLevel, lockOption, redistribute, unlockOption, validateOptionIndex } from '../util';

const getExtraAlchemyText = (extraAlchemy: number) => `이번에 연성되는 효과는 ${1 + extraAlchemy}단계 연성해${P.주겠네}.`;
const getExtraTargetText = (extraTarget: number) => `이번 연성에서 ${extraTarget + 1}개의 효과를 동시에 연성해${P.주겠네}.`;
const getOtherOptionLevelDownText = (n: number, optionName?: string) => `대신 ${optionName ? `${optionName} 효과` : '다른 효과 1개'}의 단계는 ${n} 감소${P.할걸세}.`;

/** TODO: 봉인된 옵션에 대한 처리 방식 조사하기
 * 1. 단계 위/아래로 한칸씩 이동
 * 2. 재분배
 * 3. 뒤섞기
 */

type AdviceTemplate = (odds: number, params: AdviceTemplateProps) => AdviceBody;

const createFixedOptionAdvices = (odds: number, template: AdviceTemplate, params: AdviceTemplateProps) => Array.from({ length: OPTION_COUNT }).map((_, idx) => template(odds / OPTION_COUNT, { ...params, optionIndex: idx }));

const createFixedSubOptionAdvices = (odds: number, template: AdviceTemplate, params: AdviceTemplateProps) => {
  const result = [];
  for (let i = 0; i < OPTION_COUNT; i++) {
    for (let j = 0; j < OPTION_COUNT; j++) {
      if (i === j) continue;
      result.push(template(odds / (OPTION_COUNT * OPTION_COUNT - 1), { ...params, optionIndex: i, subOptionIndex: j }));
    }
  }
  return result;
};

export const ADVICES: AdviceBody[] = [
  ...createFixedOptionAdvices(1, potentialLevelUpFixedOptionAdviceTemplate, { percentage: 25 }),
  ...createFixedOptionAdvices(1, potentialLevelUpFixedOptionAdviceTemplate, { percentage: 50 }),
  potentialLevelSelectedOptionAdviceTemplate(1, { percentage: 25 }),
  potentialLevelSelectedOptionAdviceTemplate(1, { percentage: 50 }),

  ...createFixedOptionAdvices(1, potentialChangeLevelFixedOptionAdviceTemplate, { maxRisk: 2, maxReturn: 2 }),
  ...createFixedOptionAdvices(1, potentialChangeLevelFixedOptionAdviceTemplate, { maxRisk: 1, maxReturn: 2 }),
  potentialChangeLevelSelectedOptionAdviceTemplate(1, { maxRisk: 2, maxReturn: 2 }),
  potentialChangeLevelSelectedOptionAdviceTemplate(1, { maxRisk: 1, maxReturn: 2 }),

  // 확정 레벨업, 리스크 O
  levelUpHighestOptionAdviceTemplate(1, { maxReturn: 1, maxRisk: 2 }),
  levelUpLowestOptionAdviceTemplate(1),
  levelUpRandomOptionAdviceTemplate(1, { n: 1 }),
  levelUpRandomOptionAdviceTemplate(1, { n: 3, special: SageTypesTypes.ORDER }),
  levelUpSelectedOptionAdviceTemplate(1, { n: 2, special: SageTypesTypes.ORDER }),
  levelUpHighestOptionAdviceTemplate(1, { maxReturn: 1, special: SageTypesTypes.ORDER }),

  // 고정 레벨 변경
  raiseAllBelowNAdviceTemplate(0.5, { n: 0, remainChanceUpperBound: 12, remainChanceLowerBound: 9 }),
  raiseAllBelowNAdviceTemplate(0.5, { n: 2, remainChanceUpperBound: 9, remainChanceLowerBound: 6 }),
  raiseAllBelowNAdviceTemplate(0.5, { n: 4, remainChanceUpperBound: 6, remainChanceLowerBound: 3 }),
  raiseAllBelowNAdviceTemplate(0.5, { n: 6, remainChanceUpperBound: 3 }),

  ...createFixedOptionAdvices(1, changeFixedOptionToFixedLevelAdviceTemplate, { n: 1, remainChanceUpperBound: 12, remainChanceLowerBound: 9 }),
  ...createFixedOptionAdvices(1, changeFixedOptionToFixedLevelAdviceTemplate, { n: 2, remainChanceUpperBound: 9, remainChanceLowerBound: 6 }),
  ...createFixedOptionAdvices(1, changeFixedOptionToFixedLevelAdviceTemplate, { n: 3, remainChanceUpperBound: 6, remainChanceLowerBound: 3 }),

  changeSelectedOptionToFixedLevelAdviceTemplate(0.5, { n: 1, remainChanceUpperBound: 12, remainChanceLowerBound: 9 }),
  changeSelectedOptionToFixedLevelAdviceTemplate(0.5, { n: 2, remainChanceUpperBound: 9, remainChanceLowerBound: 6 }),
  changeSelectedOptionToFixedLevelAdviceTemplate(0.5, { n: 3, remainChanceUpperBound: 6, remainChanceLowerBound: 3 }),
  //

  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: 100, name: `이번 연성에서 ${P.OPTION} 효과를 연성해${P.주겠네}.` }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: 70 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: 30 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: -20 }),

  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateAdviceTemplate, { percentage: 5 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateAdviceTemplate, { percentage: 10 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateAdviceTemplate, { percentage: -5 }),

  ...createFixedOptionAdvices(1, amplifyFixedOptionBigHitRateAdviceTemplate, { percentage: 7 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionBigHitRateAdviceTemplate, { percentage: 15 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionBigHitRateTemporarilyAdviceTemplate, { percentage: 100 }),

  amplifyAllBigHitRateAdviceTemplate(0.5, { percentage: 5 }),
  amplifyAllBigHitRateAdviceTemplate(0.5, { percentage: 10 }),
  amplifyAllBigHitRateAdviceTemplate(1, { percentage: 15, special: SageTypesTypes.ORDER }),
  amplifyOddOrEvenBigHitRateAdviceTemplate(1, { odd: true, percentage: 15, special: SageTypesTypes.ORDER }),
  amplifyOddOrEvenBigHitRateAdviceTemplate(1, { odd: false, percentage: 15, special: SageTypesTypes.ORDER }),
  amplifySelectedOptionBigHitRateAdviceTemplate(1, { percentage: 25, special: SageTypesTypes.ORDER }),

  potentialChangeLevelSelectedOptionAdviceTemplate(3, { maxRisk: 0, maxReturn: 4, special: SageTypesTypes.CHAOS, sage: SageKeys.L, enterMeditation: true }),
  potentialChangeLevelSelectedOptionAdviceTemplate(3, { maxRisk: -2, maxReturn: 3, special: SageTypesTypes.CHAOS, sage: SageKeys.B, enterMeditation: true }),
  potentialChangeLevelSelectedOptionAdviceTemplate(3, { maxRisk: 4, maxReturn: 5, special: SageTypesTypes.CHAOS, sage: SageKeys.C, enterMeditation: true }),

  amplifySelectedHitRateAdviceTemplate(1, { percentage: 15, special: SageTypesTypes.ORDER }),
  amplifySelectedHitRateAdviceTemplate(1, { percentage: 20, special: SageTypesTypes.ORDER }),

  addRerollChanceAdviceTemplate(1, { addRerollChance: 1, special: SageTypesTypes.ORDER }),
  addRerollChanceAdviceTemplate(1, { addRerollChance: 2, special: SageTypesTypes.ORDER }),

  moveUpLevelAdviceTemplate(2, { special: SageTypesTypes.CHAOS }),
  moveDownLevelAdviceTemplate(2, { special: SageTypesTypes.CHAOS }),

  lockRandomOptionAdviceTemplate(0.5, { remainChanceLowerBound: 8, extraChanceConsume: 1 }),
  ...createFixedOptionAdvices(0.5, lockFixedOptionAdviceTemplate, { type: 'utillock', remainChanceLowerBound: 8, extraChanceConsume: 1 }),

  unlockRandomOptionAndLockOtherOptionAdviceTemplate(2),

  ...createFixedOptionAdvices(1, lockFixedOptionAdviceTemplate, {}),
  lockSelectedOptionAdviceTemplate(1, { saveChance: true, special: SageTypesTypes.ORDER }),
  lockSelectedOptionAdviceTemplate(1, { extraTarget: 1, special: SageTypesTypes.ORDER }),
  lockSelectedOptionAdviceTemplate(1, { extraAlchemy: 1, special: SageTypesTypes.ORDER }),
  lockSelectedOptionAndRedistributeAdviceTemplate(1, { special: SageTypesTypes.CHAOS }),
  lockSelectedOptionAndLevelUpRandomOptionAdviceTemplate(1, { special: SageTypesTypes.CHAOS }),
  lockSelectedOptionAndLevelUpLowestOptionAdviceTemplate(1, { special: SageTypesTypes.CHAOS }),

  redistributeAdviceTemplate(2, { special: SageTypesTypes.CHAOS }),
  exchangeOddEvenAdviceTemplate(0.5, { odd: true, n: 1, remainChanceUpperBound: 12 }),
  exchangeOddEvenAdviceTemplate(0.5, { odd: false, n: 1, remainChanceUpperBound: 12 }),
  ...createFixedSubOptionAdvices(1, exchangeLevelBetweenFixedOptionsAdviceTemplate, { n: 1 }),
  ...createFixedSubOptionAdvices(1, exchangeLevelBetweenFixedOptionsAdviceTemplate, { n: 2 }),

  amplifySelectedOptionHitRateTemporarilyAdviceTemplate(1, { extraChanceConsume: 1, extraAlchemy: 1, remainChanceUpperBound: 11 }),

  addExtraTargetAdviceTemplate(1, { extraTarget: 1, extraChanceConsume: 1, remainChanceUpperBound: 11 }),

  extraAlchemyAdviceTemplate(0.5, { extraAlchemy: 1 }),
  extraAlchemyAdviceTemplate(1, { extraAlchemy: 2, extraChanceConsume: 1, remainChanceUpperBound: 11 }),
  extraAlchemyAdviceTemplate(0.5, { extraAlchemy: 2, special: SageTypesTypes.ORDER }),

  saveChanceAdviceTemplate(1),

  changeOptionSelectedSlotAdviceTemplate(1),

  discountGoldCostAdviceTemplate(1, { percentage: 20 }),
  discountGoldCostAdviceTemplate(1, { percentage: 40 }),
  discountGoldCostAdviceTemplate(1, { percentage: 100, special: SageTypesTypes.ORDER }),
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
  };
}

function levelUpHighestOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { maxReturn, maxRisk, special } = params;
  return {
    name: `최고 단계 효과를 ${maxReturn} 올려${P.주겠네}.${maxRisk ? ` ${getOtherOptionLevelDownText(maxRisk)}` : ''} `,
    type: 'util',
    special,
    contradictMaxLevelExists: true,
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

function levelUpLowestOptionAdviceTemplate(odds: number): AdviceBody {
  return {
    name: `최하 단계 효과를 +1 올려${P.주겠네}. 대신 최고 단계의 효과가 2 감소${P.할걸세}.`,
    type: 'util',
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
      const [targetIndex] = gacha(result);
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
  };
}

function amplifySelectedOptionHitRateTemporarilyAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { extraAlchemy, extraChanceConsume, remainChanceUpperBound } = params;
  const percentage = 100;
  return {
    name: `이번에는 ${P.자네가} ${P.선택한} 효과를 ${1 + extraAlchemy}단계 연성해${P.주겠네}. 다만 기회를 ${1 + extraChanceConsume}번 소모${P.할걸세}.`,
    type: 'util',
    remainChanceUpperBound,
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

function addExtraTargetAdviceTemplate(odds: number, params?: AdviceTemplateProps): AdviceBody {
  params ??= {};
  const { extraTarget, extraChanceConsume, remainChanceUpperBound } = params;
  return {
    name: `이번 연성에서 ${extraTarget + 1}개의 효과를 동시에 연성해${P.주겠네}.${extraChanceConsume ? ` 다만, 기회를 ${extraChanceConsume + 1}번 소모${P.할걸세}.` : ''}`,
    type: 'util',
    remainChanceUpperBound,
    effect: (options) => ({ options: options, extraTarget, extraChanceConsume }),
    odds,
    extraChanceConsume,
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
  const { extraChanceConsume, saveChance, special, remainChanceUpperBound } = params;
  return {
    name: `임의의 효과 하나를 봉인${P.하겠네}.${extraChanceConsume ? ` 다만, 기회를 ${1 + extraChanceConsume}번 소모${P.할걸세}.` : ''}${saveChance ? ` 이번 연성은 기회를 소모하지 ${P.않을걸세}.` : ''}`,
    type: 'utillock',
    special,
    remainChanceUpperBound,
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
  const { extraChanceConsume, optionIndex, type } = params;
  return {
    name: `${P.OPTION} 효과를 봉인${P.하겠네}.${extraChanceConsume ? ` 다만, 이번 연성에서 기회를 ${1 + extraChanceConsume}번 소모${P.할걸세}.` : ''}`,
    type: type ?? 'lock',
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
  const { extraChanceConsume, saveChance, special, extraAlchemy, extraTarget } = params;
  return {
    name: `선택한 효과 하나를 봉인${P.하겠네}.
    ${extraChanceConsume ? ` 다만, 기회를 ${1 + extraChanceConsume}번 소모${P.할걸세}.` : ''}
    ${saveChance ? ` 이번 연성은 기회를 소모하지 ${P.않을걸세}.` : ''}
    ${extraAlchemy ? ` ${getExtraAlchemyText(extraAlchemy)}` : ''}
    ${extraTarget ? ` ${getExtraTargetText(extraTarget)}` : ''}`,
    type: 'lock',
    special,
    effect: (options, optionIndex) => {
      validateOptionIndex(optionIndex);
      const result = options.map((option) => ({ ...option }));

      lockOption(result, optionIndex);

      return { options: result, saveChance, extraChanceConsume, extraAlchemy, extraTarget };
    },
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

      const [levelUpTargetIndex] = gacha(result);
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
    name: `${str[Number(odd)]} 슬롯의 효과를 +1 올려${P.주겠네}. 대신 ${str[Number(!odd)]} 슬롯의 효과가 1 감소${P.할걸세}.`,
    type: 'util',
    remainChanceUpperBound,
    effect: (options) => {
      const result = options.map((option) => ({ ...option }));

      result.forEach((option, idx) => {
        if ((idx % 2 === 0) === odd) applySafeResult(option, { level: option.level + 1 });
        else applySafeResult(option, { level: option.level - 1 });
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

function exchangeLevelBetweenFixedOptionsAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, optionIndex, subOptionIndex } = params;
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
