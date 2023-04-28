import { DIALOGUE_END_INDEX as I, MAX_ACTIVE, OPTION_COUNT, Placeholders } from '../constants';
import { Advice, AdviceParam } from '../type/advice';
import { SageKey, SageKeys, SageTypesType, SageTypesTypes } from '../type/sage';
import { convertToSignedString, validateOptionIndex } from '../util';

const NO_OPTION_SELECTED_ERROR_MESSAGE = '옵션을 선택해주세요.';

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
    name: `${Placeholders.OPTION} 효과의 단계를 ${Placeholders.N_NPLUS_1} 중 하나로 변경해${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect:
      ({ optionIndex, n }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        const afterLevel = n + Math.floor(Math.random() * 2);
        result[optionIndex].level = afterLevel;
        return { elixirs: result };
      },
    odds: 1,
  },
  {
    name: `선택한 효과의 단계를 ${Placeholders.N_NPLUS_1} 중 하나로 변경해${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect:
      ({ n }) =>
      (beforeElixirs, optionIndex) => {
        const result = [...beforeElixirs];
        const afterLevel = n + Math.floor(Math.random() * 2);
        result[optionIndex].level = afterLevel;
        return { elixirs: result };
      },
    odds: 1,
  },
  {
    name: `${Placeholders.OPTION} 효과의 단계를 +1 올려${Placeholders[I.주겠네]}. 대신...`,
    type: 'util',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        result[optionIndex].level++;
        return { elixirs: result };
      },
    odds: 1,
  },
  {
    name: `최고 단계 효과를 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const maxLevel = result.reduce((acc, cur) => {
        return Math.max(cur.level, acc);
      }, result[0].level);

      const candidate = result.filter((elixir) => elixir.level === maxLevel);
      const targetIndex = Math.floor(Math.random() * candidate.length);
      candidate[targetIndex].level = Math.min(candidate[targetIndex].level + 1, MAX_ACTIVE);
      return { elixirs: result };
    },
    odds: 1,
  },
  {
    name: `최하 단계 효과를 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const minLevel = result.reduce((acc, cur) => {
        return Math.min(cur.level, acc);
      }, result[0].level);

      const candidate = result.filter((elixir) => elixir.level === minLevel);
      const targetIndex = Math.floor(Math.random() * candidate.length);
      candidate[targetIndex].level = Math.min(candidate[targetIndex].level + 1, MAX_ACTIVE);
      return { elixirs: result };
    },
    odds: 1,
  },
  {
    name: `2, 4 슬롯의 효과를 +1 올려${Placeholders[I.주겠네]}. 대신...`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      result[1].level = Math.min(result[1].level + 1, MAX_ACTIVE);
      result[3].level = Math.min(result[3].level + 1, MAX_ACTIVE);
      return { elixirs: result };
    },
    odds: 1,
  },
  {
    name: `임의 효과를 +1 올려${Placeholders[I.주겠네]}. 대신 ...`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const targetIndex = Math.floor(Math.random() * OPTION_COUNT);
      result[targetIndex].level = Math.min(result[targetIndex].level + 1, MAX_ACTIVE);
      return { elixirs: result };
    },
    odds: 1,
  },
  // {
  //   name: `${N_PLACEHOLDER}단계 이하의 모든 효과를 +1 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,

  //   // TODO: n 매개변수 의미 분리 (N_TABLE, N_PLACEHOLDER) 즉 새로운 매개변수 만들기
  //   effect:
  //     ({ n }) =>
  //     (beforeElixirs) => {
  //       const result = [...beforeElixirs];
  //       const candidate = result.filter((elixir) => elixir.level <= n);
  //       for (const option of candidate) {
  //         option.level = Math.min(option.level + 1, MAX_ACTIVE);
  //       }
  //       return result;
  //     },
  //   odds: 1,
  // },
  {
    name: `연성되지 않은 모든 효과를 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const candidate = result.filter((elixir) => elixir.level === 0);
      for (const option of candidate) {
        option.level = Math.min(option.level + 1, MAX_ACTIVE);
      }
      return { elixirs: result };
    },
    odds: 1,
  },
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
  changeSelectedPotentialLevelAdviceTemplate(1, { maxRisk: 0, maxReturn: 4, special: SageTypesTypes.CHAOS, sage: SageKeys.L }),
  changeSelectedPotentialLevelAdviceTemplate(1, { maxRisk: -2, maxReturn: 3, special: SageTypesTypes.CHAOS, sage: SageKeys.B }),
  changeSelectedPotentialLevelAdviceTemplate(1, { maxRisk: 4, maxReturn: 5, special: SageTypesTypes.CHAOS, sage: SageKeys.C }),
  amplifySelectedHitRateAdviceTemplate(1, { percentage: 15, special: SageTypesTypes.ORDER, sage: SageKeys.L }),
  amplifySelectedHitRateAdviceTemplate(1, { percentage: 15, special: SageTypesTypes.ORDER, sage: SageKeys.B }),
  amplifySelectedHitRateAdviceTemplate(1, { percentage: 15, special: SageTypesTypes.ORDER, sage: SageKeys.C }),
  extraTargetAdviceTemplate(1, { extraTarget: 1, extraChanceConsume: 1 }),
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
        if (Math.random() * 100 <= percentage) result[optionIndex].level++;
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
      if (!optionIndex) throw new Error(NO_OPTION_SELECTED_ERROR_MESSAGE);
      if (Math.random() * 100 <= percentage) result[optionIndex].level++;
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
        const diff = Math.floor(Math.random() * maxReturn - maxRisk + 1) - maxRisk;
        result[optionIndex].level = Math.max(result[optionIndex].level + diff, 0);
        return { elixirs: result };
      },
    odds,
  };
}

interface AdviceTemplateProps {
  name?: string;
  percentage?: number;
  special?: SageTypesType;
  sage?: SageKey;
  maxRisk?: number;
  maxReturn?: number;
  extraTarget?: number;
  extraChanceConsume?: number;
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
  const { special, sage, maxRisk, maxReturn } = props;
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
      const diff = Math.floor(Math.random() * (maxReturn - maxRisk + 1)) - maxRisk;
      result[optionIndex].level = Math.max(result[optionIndex].level + diff, 0);
      return { elixirs: result };
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

          if (optionIndex === idx) option.hitRate += percentage;
          else option.hitRate -= percentage / (OPTION_COUNT - 1);
          option.hitRate = Math.max(Math.min(option.hitRate, 100), 0);
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
        result.forEach((option, idx) => {
          if (optionIndex === idx) option.hitRate += percentage;
          else option.hitRate -= percentage / (OPTION_COUNT - 1);
          option.hitRate = Math.max(Math.min(option.hitRate, 100), 0);

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
      validateOptionIndex(optionIndex);
      result.forEach((option, idx) => {
        if (optionIndex === idx) option.hitRate += percentage;
        else option.hitRate -= percentage / (OPTION_COUNT - 1);
        option.hitRate = Math.max(Math.min(option.hitRate, 100), 0);

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
          if (optionIndex === idx) option.bigHitRate += percentage;
          option.bigHitRate = Math.max(Math.min(option.bigHitRate, 100), 0);

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

          if (optionIndex === idx) option.bigHitRate += percentage;
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
