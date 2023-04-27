export const OPTION_NAME_PLACEHOLDER = '?{option}';

export const ADVICES: Advice[] = [
  {
    name: `${OPTION_NAME_PLACEHOLDER} 효과를 25% 확률로 +1 올려`,
    effect:
      (beforeElixirs, { optionIdx }) =>
      () => {
        const result = [...beforeElixirs];
        if (Math.random() * 100 <= 25) result[optionIdx].level++;
        return result;
      },
    odds: 1,
  },
  {
    name: `${OPTION_NAME_PLACEHOLDER} 효과를 50% 확률로 +1 올려`,
    effect:
      (beforeElixirs, { optionIdx }) =>
      () => {
        const result = [...beforeElixirs];
        if (Math.random() * 100 <= 50) result[optionIdx].level++;
        return result;
      },
    odds: 1,
  },
  {
    name: `선택한 효과를 25% 확률로 +1 올려`,
    effect: (beforeElixirs) => () => {
      return (optionIdx) => {
        const result = [...beforeElixirs];
        if (Math.random() * 100 <= 25) result[optionIdx].level++;
        return result;
      };
    },
    odds: 1,
  },
  {
    name: `선택한 효과를 50% 확률로 +1 올려`,
    effect: (beforeElixirs) => () => {
      return (optionIdx) => {
        const result = [...beforeElixirs];
        if (Math.random() * 100 <= 50) result[optionIdx].level++;
        return result;
      };
    },
    odds: 1,
  },
  {
    name: `${OPTION_NAME_PLACEHOLDER} 효과를 -2 ~ +2 단계 올려`,
    effect:
      (beforeElixirs, { optionIdx }) =>
      () => {
        const result = [...beforeElixirs];
        const diff = Math.floor(Math.random() * 5) - 2;
        // TODO: 0 밑으로 떨어지지 않게 하기
        result[optionIdx].level += diff;
        return result;
      },
    odds: 1,
  },
  {
    name: `${OPTION_NAME_PLACEHOLDER} 효과를 -1 ~ +2 단계 올려`,
    effect:
      (beforeElixirs, { optionIdx }) =>
      () => {
        const result = [...beforeElixirs];
        const diff = Math.floor(Math.random() * 4) - 1;
        result[optionIdx].level += diff;
        return result;
      },
    odds: 1,
  },
  {
    name: `선택한 효과를 -2 ~ +2 단계 올려`,
    effect: (beforeElixirs) => () => {
      return (optionIdx) => {
        const result = [...beforeElixirs];
        const diff = Math.floor(Math.random() * 5) - 2;
        result[optionIdx].level += diff;
        return result;
      };
    },
    odds: 1,
  },
  {
    name: `선택한 효과를 -1 ~ +2 단계 올려`,
    effect: (beforeElixirs) => () => {
      return (optionIdx) => {
        const result = [...beforeElixirs];
        const diff = Math.floor(Math.random() * 4) - 1;
        result[optionIdx].level += diff;
        return result;
      };
    },
    odds: 1,
  },
];
