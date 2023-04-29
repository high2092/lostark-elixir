import { DIALOGUE_END_INDEX as I, MAX_ACTIVE, OPTION_COUNT, Placeholders } from '../constants';
import { Advice } from '../type/advice';
import { SageKey, SageKeys, SageTypesType, SageTypesTypes } from '../type/sage';
import { applyAdvice, convertToSignedString, gacha, getLockedCount, validateOptionIndex } from '../util';

const NO_OPTION_SELECTED_ERROR_MESSAGE = '옵션을 선택해주세요.';
const getExtraAlchemyText = (extraAlchemy: number) => `이번에 연성되는 효과는 ${1 + extraAlchemy}단계 연성해${Placeholders[I.주겠네]}.`;
const getExtraTargetText = (extraTarget: number) => `이번 연성에서 ${extraTarget + 1}개의 효과를 동시에 연성해${Placeholders[I.주겠네]}.`;

/** TODO: 봉인된 옵션에 대한 처리 방식 조사하기
 * 1. 단계 위/아래로 한칸씩 이동
 * 2. 재분배
 * 3. 뒤섞기
 */

const INF = 2147483647;

export const ADVICES: Advice[] = [
  potentialAlchemyAdviceTemplate(1, { percentage: 25 }),
  potentialAlchemyAdviceTemplate(1, { percentage: 50 }),
  potentialSelectedAlchemyAdviceTemplate(1, { percentage: 25 }),
  potentialSelectedAlchemyAdviceTemplate(1, { percentage: 50 }),
  changePotentialLevelAdviceTemplate(1, { maxRisk: 2, maxReturn: 2 }),
  changePotentialLevelAdviceTemplate(1, { maxRisk: 1, maxReturn: 2 }),
  changeSelectedPotentialLevelAdviceTemplate(1, { maxRisk: 2, maxReturn: 2 }),
  changeSelectedPotentialLevelAdviceTemplate(1, { maxRisk: 1, maxReturn: 2 }),
  {
    name: `최고 단계 효과를 +1 올려${Placeholders[I.주겠네]}. 대신...`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const maxLevel = result.reduce((acc, cur) => {
        return Math.max(cur.level, acc);
      }, result[0].level);

      const candidate = result.filter((elixir) => elixir.level === maxLevel);
      const targetIndex = Math.floor(Math.random()) * candidate.length;
      applyAdvice(candidate[targetIndex], { level: candidate[targetIndex].level + 1 });
      return { elixirs: result };
    },
    odds: 1,
  },
  {
    name: `최하 단계 효과를 +1 올려${Placeholders[I.주겠네]}. 대신...`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const minLevel = result.reduce((acc, cur) => {
        return Math.min(cur.level, acc);
      }, result[0].level);

      const candidate = result.filter((elixir) => elixir.level === minLevel);
      const targetIndex = Math.floor(Math.random()) * candidate.length;
      applyAdvice(candidate[targetIndex], { level: candidate[targetIndex].level + 1 });
      return { elixirs: result };
    },
    odds: 1,
  },
  {
    name: `임의 효과를 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const candidate = result.filter((option) => !option.locked);
      const targetIndex = Math.floor(Math.random()) * candidate.length;
      applyAdvice(candidate[targetIndex], { level: candidate[targetIndex].level + 1 });
      return { elixirs: result };
    },
    odds: 1,
  },
  raiseAllBelowNAdviceTemplate(1, { n: 0, remainChanceLowerBound: 10 }),
  raiseAllBelowNAdviceTemplate(1, { n: 2, remainChanceUpperBound: 9, remainChanceLowerBound: 6 }),
  raiseAllBelowNAdviceTemplate(1, { n: 2, remainChanceUpperBound: 6, remainChanceLowerBound: 3 }),
  raiseAllBelowNAdviceTemplate(1, { n: 2, remainChanceUpperBound: 2 }),
  changeOptionToFixedLevelAdviceTemplate(1, { n: 1, remainChanceLowerBound: 10 }),
  changeOptionToFixedLevelAdviceTemplate(1, { n: 2, remainChanceUpperBound: 9, remainChanceLowerBound: 6 }),
  changeOptionToFixedLevelAdviceTemplate(1, { n: 3, remainChanceUpperBound: 5, remainChanceLowerBound: 3 }),
  changeSelectedOptionToFixedLevelAdviceTemplate(1, { n: 1, remainChanceLowerBound: 10 }),
  changeSelectedOptionToFixedLevelAdviceTemplate(1, { n: 2, remainChanceUpperBound: 9, remainChanceLowerBound: 6 }),
  changeSelectedOptionToFixedLevelAdviceTemplate(1, { n: 3, remainChanceUpperBound: 5, remainChanceLowerBound: 3 }),
  amplifyHitRateTemporarilyAdviceTemplate(1, { percentage: 100, name: `이번 연성에서 ${Placeholders.OPTION} 효과를 연성해${Placeholders[I.주겠네]}.` }),
  amplifyHitRateTemporarilyAdviceTemplate(1, { percentage: 70 }),
  amplifyHitRateTemporarilyAdviceTemplate(1, { percentage: 30 }),
  amplifyHitRateTemporarilyAdviceTemplate(1, { percentage: -20 }),
  amplifyHitRateAdviceTemplate(1, { percentage: 5 }),
  amplifyHitRateAdviceTemplate(1, { percentage: 10 }),
  amplifyHitRateAdviceTemplate(1, { percentage: -5 }),
  amplifyBigHitRateAdviceTemplate(1, { percentage: 7 }),
  amplifyBigHitRateAdviceTemplate(1, { percentage: 15 }),
  amplifyBigHitRateTemporarilyAdviceTemplate(1, { percentage: 100 }),
  changeSelectedPotentialLevelAdviceTemplate(3, { maxRisk: 0, maxReturn: 4, special: SageTypesTypes.CHAOS, sage: SageKeys.L, enterMeditation: true }),
  changeSelectedPotentialLevelAdviceTemplate(3, { maxRisk: -2, maxReturn: 3, special: SageTypesTypes.CHAOS, sage: SageKeys.B, enterMeditation: true }),
  changeSelectedPotentialLevelAdviceTemplate(3, { maxRisk: 4, maxReturn: 5, special: SageTypesTypes.CHAOS, sage: SageKeys.C, enterMeditation: true }),
  amplifySelectedHitRateAdviceTemplate(1, { percentage: 15, special: SageTypesTypes.ORDER }),
  extraTargetAdviceTemplate(1, { extraTarget: 1, extraChanceConsume: 1 }),
  addRerollChanceAdviceTemplate(1, { addRerollChance: 1, special: SageTypesTypes.ORDER }),
  addRerollChanceAdviceTemplate(1, { addRerollChance: 2, special: SageTypesTypes.ORDER }),
  moveUpLevelAdviceTemplate(2, { special: SageTypesTypes.CHAOS }),
  moveDownLevelAdviceTemplate(2, { special: SageTypesTypes.CHAOS }),
  lockAdviceTemplate(2 * INF, { extraChanceConsume: 0, remainChanceUpperBound: 3 }),
  lockSelectedOptionAdviceTemplate(INF, { saveChance: true, special: SageTypesTypes.ORDER, remainChanceUpperBound: 3 }),
  lockSelectedOptionAdviceTemplate(INF, { extraTarget: 1, special: SageTypesTypes.ORDER, remainChanceUpperBound: 3 }),
  lockSelectedOptionAdviceTemplate(INF, { extraAlchemy: 1, special: SageTypesTypes.ORDER, remainChanceUpperBound: 3 }),
  lockSelectedOptionAdviceTemplate(3 * INF, { remainChanceUpperBound: 3 }),
  redistributeAdviceTemplate(2, { special: SageTypesTypes.CHAOS }),
  exchangeOddEvenAdviceTemplate(1, { odd: true, n: 1 }),
  exchangeOddEvenAdviceTemplate(1, { odd: false, n: 1 }),
  exchangeOneLevelBetweenRandomTwoOptionsAdviceTemplate(1, { n: 1 }),
  exchangeOneLevelBetweenRandomTwoOptionsAdviceTemplate(1, { n: 2 }),
  extraAlchemyAdviceTemplate(1, { extraAlchemy: 2, extraChanceConsume: 1 }),
];

function potentialAlchemyAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { percentage } = params;
  return {
    name: `${Placeholders.OPTION} 효과를 ${percentage}% 확률로 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'potential',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        if (Math.random() * 100 <= percentage) applyAdvice(result[optionIndex], { level: result[optionIndex].level + 1 });
        return { elixirs: result };
      },
    odds,
  };
}

function potentialSelectedAlchemyAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { percentage } = params;
  return {
    name: `선택한 효과를 ${percentage}% 확률로 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'potential',
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      if (typeof optionIndex !== 'number') throw new Error(NO_OPTION_SELECTED_ERROR_MESSAGE);
      if (Math.random() * 100 <= percentage) applyAdvice(result[optionIndex], { level: result[optionIndex].level + 1 });
      return { elixirs: result };
    },
    odds,
  };
}

function changePotentialLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { maxRisk, maxReturn } = params;
  return {
    name: `${Placeholders.OPTION} 효과를 [${convertToSignedString(-maxRisk)}~${convertToSignedString(maxReturn)}] 중 하나만큼 올려${Placeholders[I.주겠네]}.`,
    type: 'potential',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        const diff = Math.floor(Math.random() * maxReturn + maxRisk + 1) - maxRisk;
        applyAdvice(result[optionIndex], { level: result[optionIndex].level + diff });
        return { elixirs: result };
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
}

/**
 *
 * @param maxRisk 0 이상의 정수
 * @param maxReturn -maxRisk 이상의 정수
 * @param odds 조언 등장 확률
 * @param props 풀스택 또는 특정 현자인 경우
 * @returns
 */
function changeSelectedPotentialLevelAdviceTemplate(odds: number, props?: AdviceTemplateProps): Advice {
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
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      const diff = Math.floor(Math.random() * (maxReturn + maxRisk + 1)) - maxRisk;
      applyAdvice(result[optionIndex], { level: result[optionIndex].level + diff });
      return { elixirs: result, enterMeditation };
    },
    odds,
  };
}

function amplifyHitRateTemporarilyAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { percentage, name } = params;
  return {
    name: name ?? `이번 연성에서 ${Placeholders.OPTION} 효과의 연성 확률을 ${Math.abs(percentage)}% ${percentage >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        result.forEach((option, idx) => {
          option.nextHitRate = option.hitRate;

          if (optionIndex === idx) applyAdvice(option, { hitRate: option.hitRate + percentage });
          else applyAdvice(option, { hitRate: option.hitRate - percentage / (OPTION_COUNT - 1) });
        });
        return { elixirs: result };
      },
    odds,
  };
}

function amplifyHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { percentage } = params;
  return {
    name: `남은 연성에서 ${Placeholders.OPTION} 효과의 연성 확률을 ${Math.abs(percentage)}% ${percentage >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        const lockedCount = getLockedCount(result);
        result.forEach((option, idx) => {
          if (option.locked) return;

          if (optionIndex === idx) applyAdvice(option, { hitRate: option.hitRate + percentage });
          else applyAdvice(option, { hitRate: option.hitRate - percentage / (OPTION_COUNT - lockedCount - 1) });

          option.nextHitRate = option.hitRate;
        });
        return { elixirs: result };
      },
    odds,
  };
}

function amplifySelectedHitRateAdviceTemplate(odds: number, props?: AdviceTemplateProps): Advice {
  props ??= {};
  const { special, sage, percentage } = props;
  return {
    name: `남은 연성에서 선택한 효과의 연성 확률을 ${Math.abs(percentage)}% ${percentage >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    special,
    sage,
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      const lockedCount = getLockedCount(result);
      validateOptionIndex(optionIndex);
      result.forEach((option, idx) => {
        if (optionIndex === idx) applyAdvice(option, { hitRate: option.hitRate + percentage });
        else applyAdvice(option, { hitRate: option.hitRate - percentage / (OPTION_COUNT - lockedCount - 1) });

        option.nextHitRate = option.hitRate;
      });
      return { elixirs: result };
    },
    odds,
  };
}

function amplifyBigHitRateAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { percentage } = params;
  return {
    name: `남은 연성에서 ${Placeholders.OPTION} 효과의 대성공 확률을 ${Math.abs(percentage)}% ${percentage >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        result.forEach((option, idx) => {
          if (optionIndex === idx) applyAdvice(option, { bigHitRate: option.bigHitRate + percentage });

          option.nextBigHitRate = option.bigHitRate;
        });
        return { elixirs: result };
      },
    odds,
  };
}

function amplifyBigHitRateTemporarilyAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { percentage } = params;
  return {
    name: `이번 연성에서 ${Placeholders.OPTION} 효과의 대성공 확률을 ${Math.abs(percentage)}% ${percentage >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        result.forEach((option, idx) => {
          option.nextBigHitRate = option.bigHitRate;

          if (optionIndex === idx) applyAdvice(option, { bigHitRate: option.bigHitRate + percentage });
          option.bigHitRate = Math.max(Math.min(option.bigHitRate, 100), 0);
        });
        return { elixirs: result };
      },
    odds,
  };
}

function extraTargetAdviceTemplate(odds: number, params?: AdviceTemplateProps): Advice {
  params ??= {};
  const { extraTarget, extraChanceConsume } = params;
  return {
    name: `이번 연성에서 ${extraTarget + 1}개의 효과를 동시에 연성해${Placeholders[I.주겠네]}.${extraChanceConsume ? ` 다만, 기회를 ${extraChanceConsume + 1}번 소모${Placeholders[I.할걸세]}.` : ''}`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      return { elixirs: beforeElixirs, extraTarget, extraChanceConsume };
    },
    odds,
  };
}

function addRerollChanceAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { addRerollChance, special } = params;
  return {
    name: `다른 조언 보기 횟수를 ${addRerollChance}회 늘려${Placeholders[I.주겠네]}.`,
    type: 'util',
    special,
    effect: () => (beforeElixirs) => {
      return { elixirs: beforeElixirs, addRerollChance };
    },
    odds,
  };
}

function moveUpLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { special } = params;
  return {
    name: `모든 효과의 단계를 위로 1 슬롯 씩 올려${Placeholders[I.주겠네]}.`,
    type: 'util',
    special,
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const firstLevel = result[0].level;
      for (let i = 0; i < OPTION_COUNT - 1; i++) {
        result[i].level = result[i + 1].level;
      }
      result[OPTION_COUNT - 1].level = firstLevel;
      return { elixirs: result };
    },
    odds,
  };
}

function moveDownLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { special } = params;
  return {
    name: `모든 효과의 단계를 아래로 1 슬롯 씩 내려${Placeholders[I.주겠네]}.`,
    type: 'util',
    special,
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const lastLevel = result[OPTION_COUNT - 1].level;
      for (let i = 0; i < OPTION_COUNT - 1; i++) {
        result[i + 1].level = result[i].level;
      }
      result[0].level = lastLevel;
      return { elixirs: result };
    },
    odds,
  };
}

function lockAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { extraChanceConsume, saveChance, special, remainChanceUpperBound } = params;
  return {
    name: `임의의 효과 하나를 봉인${Placeholders[I.하겠네]}.${extraChanceConsume ? ` 다만, 기회를 ${1 + extraChanceConsume}번 소모${Placeholders[I.할걸세]}.` : ''}${saveChance ? ` 이번 연성은 기회를 소모하지 ${Placeholders[I.않을걸세]}.` : ''}`,
    type: 'util',
    special,
    remainChanceUpperBound,
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const [idx] = gacha(result);
      result[idx].locked = true;
      const lockedCount = result.reduce((acc, cur) => acc + Number(cur.locked), 0);
      for (let i = 0; i < OPTION_COUNT; i++) {
        if (!result[i].locked) {
          applyAdvice(result[i], { hitRate: result[i].hitRate + result[idx].hitRate / (OPTION_COUNT - lockedCount) });
          result[i].nextHitRate = result[i].hitRate;
        }
      }

      return { elixirs: result, saveChance, extraChanceConsume };
    },
    odds,
  };
}

function lockSelectedOptionAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { extraChanceConsume, saveChance, special, remainChanceUpperBound, extraAlchemy, extraTarget } = params;
  return {
    name: `선택한 효과 하나를 봉인${Placeholders[I.하겠네]}.
    ${extraChanceConsume ? ` 다만, 기회를 ${1 + extraChanceConsume}번 소모${Placeholders[I.할걸세]}.` : ''}
    ${saveChance ? ` 이번 연성은 기회를 소모하지 ${Placeholders[I.않을걸세]}.` : ''}
    ${extraAlchemy ? ` ${getExtraAlchemyText(extraAlchemy)}` : ''}
    ${extraTarget ? ` ${getExtraTargetText(extraTarget)}` : ''}`,
    type: 'util',
    special,
    remainChanceUpperBound,
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      result[optionIndex].locked = true;
      const lockedCount = result.reduce((acc, cur) => acc + Number(cur.locked), 0);
      for (let i = 0; i < OPTION_COUNT; i++) {
        if (!result[i].locked) {
          applyAdvice(result[i], { hitRate: result[i].hitRate + result[optionIndex].hitRate / (OPTION_COUNT - lockedCount) });
          result[i].nextHitRate = result[i].hitRate;
        }
      }

      return { elixirs: result, saveChance, extraChanceConsume, extraAlchemy, extraTarget };
    },
    odds,
  };
}

function redistributeAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { special } = params;

  return {
    name: `모든 효과의 단계를 재분배${Placeholders[I.하겠네]}.`,
    type: 'util',
    special,
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];

      const lockedCount = getLockedCount(result);
      let levelSum = result.reduce((acc, cur) => {
        if (!cur.locked) acc += cur.level;
        return acc;
      }, 0);
      const shares = Array.from({ length: OPTION_COUNT - lockedCount }).map((_) => 0);

      while (levelSum) {
        const idx = Math.floor(Math.random() * (OPTION_COUNT - lockedCount));
        shares[idx]++;
        levelSum--;
      }

      let i = 0;
      for (const option of result) {
        if (option.locked) continue;
        applyAdvice(option, { level: shares[i++] });
      }

      return { elixirs: result };
    },
    odds,
  };
}

function raiseAllBelowNAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { n, remainChanceUpperBound, remainChanceLowerBound } = params;
  return {
    name: `${n === 0 ? '연성되지 않은' : `${n}단계 이하의`} 모든 효과를 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'util',
    remainChanceUpperBound,
    remainChanceLowerBound,
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const candidate = result.filter((option) => option.level <= n && !option.locked);
      for (const option of candidate) {
        applyAdvice(option, { level: option.level + 1 });
      }
      return { elixirs: result };
    },
    odds,
  };
}

function changeOptionToFixedLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { n, remainChanceUpperBound, remainChanceLowerBound } = params;
  return {
    name: `${Placeholders.OPTION} 효과의 단계를 [${n}~${n + 1}] 중 하나로 변경해${Placeholders[I.주겠네]}.`,
    type: 'util',
    remainChanceUpperBound,
    remainChanceLowerBound,
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        applyAdvice(result[optionIndex], { level: n + Math.floor(Math.random() * 2) });
        return { elixirs: result };
      },
    odds,
  };
}

function changeSelectedOptionToFixedLevelAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { n, remainChanceUpperBound, remainChanceLowerBound } = params;
  return {
    name: `선택한 효과의 단계를 [${n}~${n + 1}] 중 하나로 변경해${Placeholders[I.주겠네]}.`,
    type: 'util',
    remainChanceUpperBound,
    remainChanceLowerBound,
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      applyAdvice(result[optionIndex], { level: n + Math.floor(Math.random() * 2) });
      return { elixirs: result };
    },
    odds,
  };
}

function exchangeOddEvenAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { odd } = params;
  const str = ['2, 4', '1, 3, 5'];
  return {
    name: `${str[Number(odd)]} 슬롯의 효과를 +1 올려${Placeholders[I.주겠네]}. 대신 ${str[Number(!odd)]} 슬롯의 효과가 1 감소${Placeholders[I.할걸세]}.`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];

      for (let i = 0; i < result.length; i++) {
        const option = result[i];
        if ((i % 2 === 0) === odd) applyAdvice(option, { level: option.level + 1 });
        else applyAdvice(option, { level: option.level - 1 });
      }

      return { elixirs: result };
    },
    odds,
  };
}

function exchangeOneLevelBetweenRandomTwoOptionsAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { n } = params;
  return {
    name: `${Placeholders.OPTION} 효과의 단계를 +1 올려${Placeholders[I.주겠네]}. 대신 ${Placeholders.SUB_OPTION} 효과의 단계가 ${n} 감소${Placeholders[I.할걸세]}.`,
    type: 'util',
    effect:
      ({ optionIndex, subIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        applyAdvice(result[optionIndex], { level: result[optionIndex].level + 1 });
        applyAdvice(result[subIndex], { level: result[subIndex].level - n });
        return { elixirs: result };
      },
    odds,
  };
}

function extraAlchemyAdviceTemplate(odds: number, params: AdviceTemplateProps): Advice {
  const { extraAlchemy, extraChanceConsume } = params;
  return {
    name: `${getExtraAlchemyText(extraAlchemy)}.${extraChanceConsume ? ` 다만, 기회를 ${extraChanceConsume + 1}번 소모${Placeholders[I.할걸세]}.` : ''}`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      return { elixirs: beforeElixirs, extraAlchemy, extraChanceConsume };
    },
    odds,
  };
}
