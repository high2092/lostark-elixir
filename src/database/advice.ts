import { MAX_ACTIVE, OPTION_COUNT } from '../constants';

export const OPTION_NAME_PLACEHOLDER = '?{option}';
export const N_NPLUS1_PLACEHOLDER = '?{[n~n+1]}';
export const N_PLACEHOLDER = '?{n}';
export const ADVICE_DIALOGUE_END1_PLACEHOLDER = '?{END1}';

export const ADVICES: Advice[] = [
  {
    name: `${OPTION_NAME_PLACEHOLDER} 효과를 25% 확률로 +1 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'potential',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        if (Math.random() * 100 <= 25) result[optionIndex].level++;
        return result;
      },
    odds: 1,
  },
  {
    name: `${OPTION_NAME_PLACEHOLDER} 효과를 50% 확률로 +1 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'potential',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        if (Math.random() * 100 <= 50) result[optionIndex].level++;
        return result;
      },
    odds: 1,
  },
  {
    name: `선택한 효과를 25% 확률로 +1 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'potential',
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      if (Math.random() * 100 <= 25) result[optionIndex].level++;
      return result;
    },

    odds: 1,
  },

  {
    name: `선택한 효과를 50% 확률로 +1 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'potential',
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      if (Math.random() * 100 <= 50) result[optionIndex].level++;
      return result;
    },
    odds: 1,
  },
  {
    name: `${OPTION_NAME_PLACEHOLDER} 효과를 -2 ~ +2 단계 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'potential',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        const diff = Math.floor(Math.random() * 5) - 2;
        result[optionIndex].level = Math.max(result[optionIndex].level + diff, 0);
        return result;
      },
    odds: 1,
  },
  {
    name: `${OPTION_NAME_PLACEHOLDER} 효과를 -1 ~ +2 단계 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'potential',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        const diff = Math.floor(Math.random() * 4) - 1;
        result[optionIndex].level = Math.max(result[optionIndex].level + diff, 0);
        return result;
      },
    odds: 1,
  },
  {
    name: `선택한 효과를 -2 ~ +2 단계 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'potential',
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      const diff = Math.floor(Math.random() * 5) - 2;
      result[optionIndex].level = Math.max(result[optionIndex].level + diff, 0);
      return result;
    },
    odds: 1,
  },
  {
    name: `선택한 효과를 -1 ~ +2 단계 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'potential',
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      const diff = Math.floor(Math.random() * 4) - 1;
      result[optionIndex].level += diff;
      return result;
    },
    odds: 1,
  },
  {
    name: `${OPTION_NAME_PLACEHOLDER} 효과의 단계를 ${N_NPLUS1_PLACEHOLDER} 중 하나로 변경해${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'util',
    effect:
      ({ optionIndex, n }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        const afterLevel = n + Math.floor(Math.random() * 2);
        result[optionIndex].level = afterLevel;
        return result;
      },
    odds: 1,
  },
  {
    name: `선택한 효과의 단계를 ${N_NPLUS1_PLACEHOLDER} 중 하나로 변경해${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'util',
    effect:
      ({ n }) =>
      (beforeElixirs, optionIndex) => {
        const result = [...beforeElixirs];
        const afterLevel = n + Math.floor(Math.random() * 2);
        result[optionIndex].level = afterLevel;
        return result;
      },
    odds: 1,
  },
  {
    name: `${OPTION_NAME_PLACEHOLDER} 효과의 단계를 +1 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}. 대신...`,
    type: 'util',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs) => {
        const result = [...beforeElixirs];
        result[optionIndex].level++;
        return result;
      },
    odds: 1,
  },
  {
    name: `최고 단계 효과를 +1 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const maxLevel = result.reduce((acc, cur) => {
        return Math.max(cur.level, acc);
      }, result[0].level);

      const candidate = result.filter((elixir) => elixir.level === maxLevel);
      const targetIndex = Math.floor(Math.random() * candidate.length);
      candidate[targetIndex].level = Math.min(candidate[targetIndex].level + 1, MAX_ACTIVE);
      return result;
    },
    odds: 1,
  },
  {
    name: `최하 단계 효과를 +1 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const minLevel = result.reduce((acc, cur) => {
        return Math.min(cur.level, acc);
      }, result[0].level);

      const candidate = result.filter((elixir) => elixir.level === minLevel);
      const targetIndex = Math.floor(Math.random() * candidate.length);
      candidate[targetIndex].level = Math.min(candidate[targetIndex].level + 1, MAX_ACTIVE);
      return result;
    },
    odds: 1,
  },
  {
    name: `2, 4 슬롯의 효과를 +1 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}. 대신...`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      result[1].level = Math.min(result[1].level + 1, MAX_ACTIVE);
      result[3].level = Math.min(result[3].level + 1, MAX_ACTIVE);
      return result;
    },
    odds: 1,
  },
  {
    name: `임의 효과를 +1 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}. 대신 ...`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const targetIndex = Math.floor(Math.random() * OPTION_COUNT);
      result[targetIndex].level = Math.min(result[targetIndex].level + 1, MAX_ACTIVE);
      return result;
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
    name: `연성되지 않은 모든 효과를 +1 올려${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'util',
    effect: () => (beforeElixirs) => {
      const result = [...beforeElixirs];
      const candidate = result.filter((elixir) => elixir.level === 0);
      for (const option of candidate) {
        option.level = Math.min(option.level + 1, MAX_ACTIVE);
      }
      return result;
    },
    odds: 1,
  },
  amplifyHitRateAdviceTemplate(70, 1),
  amplifyHitRateAdviceTemplate(30, 1),
  amplifyHitRateAdviceTemplate(20, 1),
];

function amplifyHitRateAdviceTemplate(n: number, odds: number): Advice {
  return {
    name: `이번 연성에서 ${OPTION_NAME_PLACEHOLDER} 효과의 연성 확률을 +${n}% 높여${ADVICE_DIALOGUE_END1_PLACEHOLDER}.`,
    type: 'util',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs: ElixirInstance[]) => {
        const result = [...beforeElixirs];
        console.log(result.map((e) => e.hitRate));
        result.forEach((option, idx) => {
          option.nextHitRate = option.hitRate;
          option.nextBigHitRate = option.bigHitRate;

          if (optionIndex === idx) option.hitRate = Math.min(option.hitRate + n, 100);
          else option.hitRate = Math.max(option.hitRate - n / (OPTION_COUNT - 1), 0);
        });
        console.log(result.map((e) => e.hitRate));
        return result;
      },
    odds,
  };
}
