import { DIALOGUE_END_INDEX as I, MAX_ACTIVE, OPTION_COUNT, Placeholders } from '../constants';
import { NoOptionSelectedError } from '../error/NoOptionSelectedError';
import { Advice, AdviceBody, AdviceType } from '../type/advice';
import { ElixirInstance } from '../type/elixir';
import { SageKey, SageKeys, SageTypesType, SageTypesTypes } from '../type/sage';
import {
  applySafeResult,
  changeHitRate,
  convertToSignedString,
  gacha,
  generateRandomInt,
  generateRandomNumber,
  getLockedCount,
  getLockedOrMaxLevelCount,
  getMaxLevel,
  getMinLevel,
  lockOption,
  redistribute,
  unlockOption,
  validateOptionIndex,
} from '../util';

const NO_OPTION_SELECTED_ERROR_MESSAGE = '옵션을 선택해주세요.';
const getExtraAlchemyText = (extraAlchemy: number) => `이번에 연성되는 효과는 ${1 + extraAlchemy}단계 연성해${Placeholders[I.주겠네]}.`;
const getExtraTargetText = (extraTarget: number) => `이번 연성에서 ${extraTarget + 1}개의 효과를 동시에 연성해${Placeholders[I.주겠네]}.`;

/** TODO: 봉인된 옵션에 대한 처리 방식 조사하기
 * 1. 단계 위/아래로 한칸씩 이동
 * 2. 재분배
 * 3. 뒤섞기
 */

const INF = 2147483647;

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

  levelUpHighestOptionAdviceTemplate(1),
  levelUpLowestOptionAdviceTemplate(1),
  levelUpRandomOptionAdviceTemplate(1),

  // 고정 레벨 변경
  raiseAllBelowNAdviceTemplate(0.5, { n: 0, remainChanceUpperBound: 14, remainChanceLowerBound: 11 }),
  raiseAllBelowNAdviceTemplate(0.5, { n: 2, remainChanceUpperBound: 10, remainChanceLowerBound: 7 }),
  raiseAllBelowNAdviceTemplate(0.5, { n: 4, remainChanceUpperBound: 6, remainChanceLowerBound: 3 }),
  raiseAllBelowNAdviceTemplate(0.5, { n: 6, remainChanceUpperBound: 2 }),

  ...createFixedOptionAdvices(1, changeFixedOptionToFixedLevelAdviceTemplate, { n: 1, remainChanceUpperBound: 14, remainChanceLowerBound: 11 }),
  ...createFixedOptionAdvices(1, changeFixedOptionToFixedLevelAdviceTemplate, { n: 2, remainChanceUpperBound: 10, remainChanceLowerBound: 7 }),
  ...createFixedOptionAdvices(1, changeFixedOptionToFixedLevelAdviceTemplate, { n: 3, remainChanceUpperBound: 6, remainChanceLowerBound: 3 }),

  changeSelectedOptionToFixedLevelAdviceTemplate(0.5, { n: 1, remainChanceUpperBound: 14, remainChanceLowerBound: 11 }),
  changeSelectedOptionToFixedLevelAdviceTemplate(0.5, { n: 2, remainChanceUpperBound: 10, remainChanceLowerBound: 7 }),
  changeSelectedOptionToFixedLevelAdviceTemplate(0.5, { n: 3, remainChanceUpperBound: 6, remainChanceLowerBound: 3 }),
  //

  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: 100, name: `이번 연성에서 ${Placeholders.OPTION} 효과를 연성해${Placeholders[I.주겠네]}.` }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: 70 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: 30 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateTemporarilyAdviceTemplate, { percentage: -20 }),
  amplifySelectedOptionHitRateTemporarilyAdviceTemplate(1, { extraChanceConsume: 1, extraAlchemy: 1 }),

  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateAdviceTemplate, { percentage: 5 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateAdviceTemplate, { percentage: 10 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionHitRateAdviceTemplate, { percentage: -5 }),

  ...createFixedOptionAdvices(1, amplifyFixedOptionBigHitRateAdviceTemplate, { percentage: 7 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionBigHitRateAdviceTemplate, { percentage: 15 }),
  ...createFixedOptionAdvices(1, amplifyFixedOptionBigHitRateTemporarilyAdviceTemplate, { percentage: 100 }),

  amplifyAllBigHitRateAdviceTemplate(1, { percentage: 5 }),
  amplifyAllBigHitRateAdviceTemplate(1, { percentage: 10 }),
  amplifyAllBigHitRateAdviceTemplate(1, { percentage: 15, special: SageTypesTypes.ORDER }),
  amplifyOddOrEvenBigHitRateAdviceTemplate(1, { odd: true, percentage: 15, special: SageTypesTypes.ORDER }),
  amplifyOddOrEvenBigHitRateAdviceTemplate(1, { odd: false, percentage: 15, special: SageTypesTypes.ORDER }),
  amplifySelectedOptionBigHitRateAdviceTemplate(1, { percentage: 25, special: SageTypesTypes.ORDER }),

  potentialChangeLevelSelectedOptionAdviceTemplate(3, { maxRisk: 0, maxReturn: 4, special: SageTypesTypes.CHAOS, sage: SageKeys.L, enterMeditation: true }),
  potentialChangeLevelSelectedOptionAdviceTemplate(3, { maxRisk: -2, maxReturn: 3, special: SageTypesTypes.CHAOS, sage: SageKeys.B, enterMeditation: true }),
  potentialChangeLevelSelectedOptionAdviceTemplate(3, { maxRisk: 4, maxReturn: 5, special: SageTypesTypes.CHAOS, sage: SageKeys.C, enterMeditation: true }),

  amplifySelectedHitRateAdviceTemplate(1, { percentage: 15, special: SageTypesTypes.ORDER }),
  amplifySelectedHitRateAdviceTemplate(1, { percentage: 20, special: SageTypesTypes.ORDER }),

  addExtraTargetAdviceTemplate(1, { extraTarget: 1, extraChanceConsume: 1 }),

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
  exchangeOddEvenAdviceTemplate(1, { odd: true, n: 1 }),
  exchangeOddEvenAdviceTemplate(1, { odd: false, n: 1 }),
  ...createFixedSubOptionAdvices(1, exchangeLevelBetweenFixedOptionsAdviceTemplate, { n: 1 }),
  ...createFixedSubOptionAdvices(1, exchangeLevelBetweenFixedOptionsAdviceTemplate, { n: 2 }),

  addExtraAlchemyChanceAdviceTemplate(1, { extraAlchemy: 2, extraChanceConsume: 1 }),
  addExtraAlchemyChanceAdviceTemplate(1, { extraAlchemy: 2, special: SageTypesTypes.ORDER }),

  saveChanceAdviceTemplate(1),
];

function potentialLevelUpFixedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, optionIndex } = params;
  return {
    name: `${Placeholders.OPTION} 효과를 ${percentage}% 확률로 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'potential',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      if (generateRandomNumber(0, 100) <= percentage) applySafeResult(result[optionIndex], { level: result[optionIndex].level + 1 });
      return { elixirs: result };
    },
    odds,
    optionIndex,
  };
}

function potentialLevelSelectedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage } = params;
  return {
    name: `선택한 효과를 ${percentage}% 확률로 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'potential',
    effect: (elixirs, optionIndex) => {
      if (optionIndex === null) throw new NoOptionSelectedError();
      const result = elixirs.map((elixir) => ({ ...elixir }));
      if (generateRandomNumber(0, 100) <= percentage) applySafeResult(result[optionIndex], { level: result[optionIndex].level + 1 });
      return { elixirs: result };
    },
    odds,
  };
}

function potentialChangeLevelFixedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { maxRisk, maxReturn, optionIndex } = params;
  return {
    name: `${Placeholders.OPTION} 효과를 [${convertToSignedString(-maxRisk)}~${convertToSignedString(maxReturn)}] 중 하나만큼 올려${Placeholders[I.주겠네]}.`,
    type: 'potential',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      const diff = generateRandomInt(-maxRisk, maxReturn + 1);
      applySafeResult(result[optionIndex], { level: result[optionIndex].level + diff });
      return { elixirs: result };
    },
    odds,
    optionIndex,
  };
}

function levelUpHighestOptionAdviceTemplate(odds: number): AdviceBody {
  return {
    name: `최고 단계 효과를 +1 올려${Placeholders[I.주겠네]}. 대신 다른 효과 1개의 단계는 2 감소${Placeholders[I.할걸세]}.`,
    type: 'util',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      const maxLevel = getMaxLevel(result);
      const [upTargetIndex] = gacha(result, { filterConditions: [(option) => option.level === maxLevel] });
      const [downTargetIndex] = gacha(result, { filterConditions: [(option, idx) => idx !== upTargetIndex] });
      applySafeResult(result[upTargetIndex], { level: result[upTargetIndex].level + 1 });
      applySafeResult(result[downTargetIndex], { level: result[downTargetIndex].level - 2 });
      return { elixirs: result };
    },
    odds,
  };
}

function levelUpLowestOptionAdviceTemplate(odds: number): AdviceBody {
  return {
    name: `최하 단계 효과를 +1 올려${Placeholders[I.주겠네]}. 대신 최고 단계의 효과가 2 감소${Placeholders[I.할걸세]}.`,
    type: 'util',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      const minLevel = getMinLevel(result);
      const maxLevel = getMaxLevel(result);
      const [upTargetIndex] = gacha(result, { filterConditions: [(option) => option.level === minLevel] });
      const [downTargetIndex] = gacha(result, { filterConditions: [(option, idx) => idx !== upTargetIndex && option.level === maxLevel] });
      applySafeResult(result[upTargetIndex], { level: result[upTargetIndex].level + 1 });
      applySafeResult(result[downTargetIndex], { level: result[downTargetIndex].level - 2 });
      return { elixirs: result };
    },
    odds,
  };
}

function levelUpRandomOptionAdviceTemplate(odds: number): AdviceBody {
  return {
    name: `임의 효과를 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      const candidate = result.filter((option) => !option.locked);
      const targetIndex = generateRandomInt(0, candidate.length);
      applySafeResult(candidate[targetIndex], { level: candidate[targetIndex].level + 1 });
      return { elixirs: result };
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
      ? `${Placeholders[I.내]} 힘을 모두 소진${Placeholders[I.하겠네]}. 대신 ${Placeholders[I.자네]}가 ${Placeholders[I.선택한]} 효과의 단계를 [${convertToSignedString(-maxRisk)}~${convertToSignedString(maxReturn)}] 중 하나만큼 ${
          Placeholders[I.올릴걸세]
        }.`
      : `선택한 효과를 [${convertToSignedString(-maxRisk)}~${convertToSignedString(maxReturn)}] 중 하나만큼 올려${Placeholders[I.주겠네]}.`,
    type: 'potential',
    special,
    sage,
    effect: (elixirs, optionIndex) => {
      if (optionIndex === null) throw new NoOptionSelectedError();
      const result = elixirs.map((elixir) => ({ ...elixir }));
      const diff = generateRandomInt(-maxRisk, maxReturn + 1);
      applySafeResult(result[optionIndex], { level: result[optionIndex].level + diff });
      return { elixirs: result, enterMeditation };
    },
    odds,
    exhaust: enterMeditation,
  };
}

function amplifyFixedOptionHitRateTemporarilyAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, name, optionIndex } = params;
  return {
    name: name ?? `이번 연성에서 ${Placeholders.OPTION} 효과의 연성 확률을 ${Math.abs(percentage)}% ${percentage >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      changeHitRate(optionIndex, percentage, result, { temp: true });
      return { elixirs: result };
    },
    odds,
    optionIndex,
  };
}

function amplifySelectedOptionHitRateTemporarilyAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { extraAlchemy, extraChanceConsume } = params;
  const percentage = 100;
  return {
    name: `이번에는 ${Placeholders[I.자네]}가 ${Placeholders[I.선택한]} 효과를 ${1 + extraAlchemy}단계 연성해${Placeholders[I.주겠네]}. 다만 기회를 ${1 + extraChanceConsume}번 소모${Placeholders[I.할걸세]}.`,
    type: 'util',
    effect: (elixirs, optionIndex) => {
      if (optionIndex === null) throw new NoOptionSelectedError();
      const result = elixirs.map((elixir) => ({ ...elixir }));
      changeHitRate(optionIndex, percentage, result, { temp: true });
      return { elixirs: result, extraAlchemy, extraChanceConsume };
    },
    odds,
  };
}

function amplifyFixedOptionHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, optionIndex } = params;
  return {
    name: `남은 연성에서 ${Placeholders.OPTION} 효과의 연성 확률을 ${Math.abs(percentage)}% ${percentage >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      changeHitRate(optionIndex, percentage, result);
      return { elixirs: result };
    },
    odds,
    optionIndex,
  };
}

function amplifySelectedHitRateAdviceTemplate(odds: number, props?: AdviceTemplateProps): AdviceBody {
  props ??= {};
  const { special, sage, percentage } = props;
  return {
    name: `남은 연성에서 선택한 효과의 연성 확률을 ${Math.abs(percentage)}% ${percentage >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    special,
    sage,
    effect: (elixirs, optionIndex) => {
      if (optionIndex === null) throw new NoOptionSelectedError();
      const result = elixirs.map((elixir) => ({ ...elixir }));
      changeHitRate(optionIndex, percentage, result);
      return { elixirs: result };
    },
    odds,
  };
}

function amplifyFixedOptionBigHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, optionIndex } = params;
  return {
    name: `남은 연성에서 ${Placeholders.OPTION} 효과의 대성공 확률을 ${percentage}% 높여${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      applySafeResult(result[optionIndex], { bigHitRate: result[optionIndex].bigHitRate + percentage });

      return { elixirs: result };
    },
    odds,
    optionIndex,
  };
}

function amplifySelectedOptionBigHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, special } = params;
  return {
    name: `남은 연성에서 선택한 효과의 대성공 확률을 ${percentage}% 높여${Placeholders[I.주겠네]}.`,
    type: 'util',
    special,
    effect: (elixirs, optionIndex) => {
      if (optionIndex === null) throw new NoOptionSelectedError();
      const result = elixirs.map((elixir) => ({ ...elixir }));

      applySafeResult(result[optionIndex], { bigHitRate: result[optionIndex].bigHitRate + percentage });

      return { elixirs: result };
    },
    odds,
  };
}

function amplifyAllBigHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, special } = params;
  return {
    name: `남은 연성에서 모든 효과의 대성공 확률을 ${percentage}% 높여${Placeholders[I.주겠네]}.`,
    type: 'util',
    special,
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      result.forEach((option) => applySafeResult(option, { bigHitRate: option.bigHitRate + percentage }));
      return { elixirs: result };
    },
    odds,
  };
}

function amplifyFixedOptionBigHitRateTemporarilyAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { percentage, optionIndex } = params;
  return {
    name: `이번 연성에서 ${Placeholders.OPTION} 효과의 대성공 확률을 ${percentage}% 높여${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      applySafeResult(result[optionIndex], { tempBigHitRate: result[optionIndex].bigHitRate + percentage });
      return { elixirs: result };
    },
    odds: odds,
    optionIndex,
  };
}

function addExtraTargetAdviceTemplate(odds: number, params?: AdviceTemplateProps): AdviceBody {
  params ??= {};
  const { extraTarget, extraChanceConsume } = params;
  return {
    name: `이번 연성에서 ${extraTarget + 1}개의 효과를 동시에 연성해${Placeholders[I.주겠네]}.${extraChanceConsume ? ` 다만, 기회를 ${extraChanceConsume + 1}번 소모${Placeholders[I.할걸세]}.` : ''}`,
    type: 'util',
    effect: (elixirs) => ({ elixirs, extraTarget, extraChanceConsume }),
    odds,
    extraChanceConsume,
  };
}

function addRerollChanceAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { addRerollChance, special } = params;
  return {
    name: `다른 조언 보기 횟수를 ${addRerollChance}회 늘려${Placeholders[I.주겠네]}.`,
    type: 'util',
    special,
    effect: (elixirs) => ({ elixirs, addRerollChance }),
    odds,
  };
}

function moveUpLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;
  return {
    name: `모든 효과의 단계를 위로 1 슬롯 씩 올려${Placeholders[I.주겠네]}.`,
    type: 'util',
    special,
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      const candidate = result.filter((elixir) => !elixir.locked);
      const firstLevel = candidate[0].level;
      for (let i = 0; i < candidate.length - 1; i++) {
        candidate[i].level = candidate[i + 1].level;
      }
      candidate[candidate.length - 1].level = firstLevel;
      return { elixirs: result };
    },
    odds,
  };
}

function moveDownLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;
  return {
    name: `모든 효과의 단계를 아래로 1 슬롯 씩 내려${Placeholders[I.주겠네]}.`,
    type: 'util',
    special,
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      const candidate = result.filter((elixir) => !elixir.locked);
      const lastLevel = candidate[candidate.length - 1].level;
      for (let i = candidate.length - 1; i > 0; i--) {
        candidate[i].level = candidate[i - 1].level;
      }
      candidate[0].level = lastLevel;
      return { elixirs: result };
    },
    odds,
  };
}

function lockRandomOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { extraChanceConsume, saveChance, special, remainChanceUpperBound } = params;
  return {
    name: `임의의 효과 하나를 봉인${Placeholders[I.하겠네]}.${extraChanceConsume ? ` 다만, 기회를 ${1 + extraChanceConsume}번 소모${Placeholders[I.할걸세]}.` : ''}${saveChance ? ` 이번 연성은 기회를 소모하지 ${Placeholders[I.않을걸세]}.` : ''}`,
    type: 'utillock',
    special,
    remainChanceUpperBound,
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      const [idx] = gacha(result);

      lockOption(result, idx);

      return { elixirs: result, saveChance, extraChanceConsume };
    },
    odds,
    extraChanceConsume,
  };
}

function lockFixedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { extraChanceConsume, optionIndex, type } = params;
  return {
    name: `${Placeholders.OPTION} 효과를 봉인${Placeholders[I.하겠네]}.${extraChanceConsume ? ` 다만, 이번 연성에서 기회를 ${1 + extraChanceConsume}번 소모${Placeholders[I.할걸세]}.` : ''}`,
    type: type ?? 'lock',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));

      lockOption(result, optionIndex);

      return { elixirs: result, extraChanceConsume };
    },
    odds,
    optionIndex,
    extraChanceConsume,
  };
}

function lockSelectedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { extraChanceConsume, saveChance, special, extraAlchemy, extraTarget } = params;
  return {
    name: `선택한 효과 하나를 봉인${Placeholders[I.하겠네]}.
    ${extraChanceConsume ? ` 다만, 기회를 ${1 + extraChanceConsume}번 소모${Placeholders[I.할걸세]}.` : ''}
    ${saveChance ? ` 이번 연성은 기회를 소모하지 ${Placeholders[I.않을걸세]}.` : ''}
    ${extraAlchemy ? ` ${getExtraAlchemyText(extraAlchemy)}` : ''}
    ${extraTarget ? ` ${getExtraTargetText(extraTarget)}` : ''}`,
    type: 'lock',
    special,
    effect: (elixirs, optionIndex) => {
      if (optionIndex === null) throw new NoOptionSelectedError();
      const result = elixirs.map((elixir) => ({ ...elixir }));

      lockOption(result, optionIndex);

      return { elixirs: result, saveChance, extraChanceConsume, extraAlchemy, extraTarget };
    },
    odds,
    extraChanceConsume,
  };
}

function lockSelectedOptionAndRedistributeAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;
  return {
    name: `선택한 효과를 봉인${Placeholders[I.하겠네]}. 그 후 모든 효과의 단계를 재분배${Placeholders[I.하겠네]}`,
    type: 'lock',
    special,
    effect: (elixirs, optionIndex) => {
      if (optionIndex === null) throw new NoOptionSelectedError();
      const result = elixirs.map((elixir) => ({ ...elixir }));
      lockOption(result, optionIndex);
      redistribute(result);
      return { elixirs: result };
    },
    odds,
  };
}

function lockSelectedOptionAndLevelUpRandomOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;
  return {
    name: `선택한 효과를 봉인${Placeholders[I.하겠네]}. 그 후 임의의 효과의 단계를 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'lock',
    special,
    effect: (elixirs, optionIndex) => {
      if (optionIndex === null) throw new NoOptionSelectedError();
      const result = elixirs.map((elixir) => ({ ...elixir }));
      lockOption(result, optionIndex);

      const [lockTargetIndex] = gacha(result);
      applySafeResult(result[lockTargetIndex], { level: result[lockTargetIndex].level + 1 });

      return { elixirs: result };
    },
    odds,
  };
}

function lockSelectedOptionAndLevelUpLowestOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;
  return {
    name: `선택한 효과를 봉인${Placeholders[I.하겠네]}. 그 후 최하 단계 효과의 단계를 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'lock',
    special,
    effect: (elixirs, optionIndex) => {
      if (optionIndex === null) throw new NoOptionSelectedError();
      const result = elixirs.map((elixir) => ({ ...elixir }));
      lockOption(result, optionIndex);

      const minLevel = getMinLevel(result);
      const candidate = result.filter((option) => option.level === minLevel);
      const [lockTargetIndex] = gacha(candidate);
      applySafeResult(candidate[lockTargetIndex], { level: candidate[lockTargetIndex].level + 1 });

      return { elixirs: result };
    },
    odds,
  };
}

function unlockRandomOptionAndLockOtherOptionAdviceTemplate(odds: number): AdviceBody {
  return {
    name: `임의의 효과 1개의 봉인을 해제하고 다른 효과 1개를 봉인해${Placeholders[I.주겠네]}.`,
    type: 'unlock',
    special: SageTypesTypes.CHAOS,
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      const [unlockTargetIndex] = gacha(result, { locked: true });
      const [lockTargetIndex] = gacha(result);

      unlockOption(result, unlockTargetIndex);
      lockOption(result, lockTargetIndex);

      return { elixirs: result };
    },
    odds,
  };
}

function redistributeAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { special } = params;

  return {
    name: `모든 효과의 단계를 재분배${Placeholders[I.하겠네]}.`,
    type: 'util',
    special,
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      redistribute(result);
      return { elixirs: result };
    },
    odds,
  };
}

function raiseAllBelowNAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, remainChanceUpperBound, remainChanceLowerBound } = params;
  return {
    name: `${n === 0 ? '연성되지 않은' : `${n}단계 이하의`} 모든 효과를 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'util',
    remainChanceUpperBound,
    remainChanceLowerBound,
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      const candidate = result.filter((option) => option.level <= n);
      candidate.forEach((option) => {
        applySafeResult(option, { level: option.level + 1 });
      });

      return { elixirs: result };
    },
    odds,
  };
}

function changeFixedOptionToFixedLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, remainChanceUpperBound, remainChanceLowerBound, optionIndex } = params;
  return {
    name: `${Placeholders.OPTION} 효과의 단계를 [${n}~${n + 1}] 중 하나로 변경해${Placeholders[I.주겠네]}.`,
    type: 'util',
    remainChanceUpperBound,
    remainChanceLowerBound,
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      applySafeResult(result[optionIndex], { level: n + generateRandomInt(0, 2) });
      return { elixirs: result };
    },
    odds: odds,
    optionIndex,
    changeLevelLowPoint: n,
  };
}

function changeSelectedOptionToFixedLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, remainChanceUpperBound, remainChanceLowerBound } = params;
  return {
    name: `선택한 효과의 단계를 [${n}~${n + 1}] 중 하나로 변경해${Placeholders[I.주겠네]}.`,
    type: 'util',
    remainChanceUpperBound,
    remainChanceLowerBound,
    effect: (elixirs, optionIndex) => {
      if (optionIndex === null) throw new NoOptionSelectedError();
      const result = elixirs.map((elixir) => ({ ...elixir }));
      applySafeResult(result[optionIndex], { level: n + generateRandomInt(0, 2) });
      return { elixirs: result };
    },
    odds,
    changeLevelLowPoint: n,
  };
}

function exchangeOddEvenAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { odd } = params;
  const str = ['2, 4', '1, 3, 5'];
  return {
    name: `${str[Number(odd)]} 슬롯의 효과를 +1 올려${Placeholders[I.주겠네]}. 대신 ${str[Number(!odd)]} 슬롯의 효과가 1 감소${Placeholders[I.할걸세]}.`,
    type: 'util',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));

      result.forEach((option, idx) => {
        if ((idx % 2 === 0) === odd) applySafeResult(option, { level: option.level + 1 });
        else applySafeResult(option, { level: option.level - 1 });
      });

      return { elixirs: result };
    },
    odds,
  };
}

function amplifyOddOrEvenBigHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { odd, percentage, special } = params;
  const str = ['2, 4', '1, 3, 5'];
  return {
    name: `남은 연성에서 ${str[Number(odd)]} 슬롯의 효과의 대성공 확률을 ${percentage}% 올려${Placeholders[I.주겠네]}.`,
    type: 'util',
    special,
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      const candidate = result.filter((_, idx) => (idx % 2 === 0) === odd);
      candidate.forEach((option) => {
        applySafeResult(option, { bigHitRate: option.bigHitRate + percentage });
      });

      return { elixirs: result };
    },
    odds,
  };
}

function exchangeLevelBetweenFixedOptionsAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { n, optionIndex, subOptionIndex } = params;
  return {
    name: `${Placeholders.OPTION} 효과의 단계를 +1 올려${Placeholders[I.주겠네]}. 대신 ${Placeholders.SUB_OPTION} 효과의 단계가 ${n} 감소${Placeholders[I.할걸세]}.`,
    type: 'util',
    effect: (elixirs) => {
      const result = elixirs.map((elixir) => ({ ...elixir }));
      applySafeResult(result[optionIndex], { level: result[optionIndex].level + 1 });
      applySafeResult(result[subOptionIndex], { level: result[subOptionIndex].level - n });
      return { elixirs: result };
    },
    odds,
    optionIndex,
    subOptionIndex,
  };
}

function addExtraAlchemyChanceAdviceTemplate(odds: number, params: AdviceTemplateProps): AdviceBody {
  const { extraAlchemy, extraChanceConsume, special } = params;
  return {
    name: `${getExtraAlchemyText(extraAlchemy)}${extraChanceConsume ? ` 다만, 기회를 ${extraChanceConsume + 1}번 소모${Placeholders[I.할걸세]}.` : ''}`,
    type: 'util',
    special,
    effect: (elixirs) => ({ elixirs, extraAlchemy, extraChanceConsume }),
    odds,
    extraChanceConsume,
  };
}

function saveChanceAdviceTemplate(odds: number): AdviceBody {
  return {
    name: `이번 연성은 기회를 소모하지 ${Placeholders[I.않을걸세]}`,
    type: 'util',
    special: SageTypesTypes.ORDER,
    effect: (elixirs) => ({ elixirs, saveChance: true }),
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
