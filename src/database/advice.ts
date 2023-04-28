import { DIALOGUE_END_INDEX as I, MAX_ACTIVE, OPTION_COUNT, Placeholders } from '../constants';
import { validateOptionIndex } from '../util';

export const ADVICES: Advice[] = [
  {
    name: `${Placeholders.OPTION} 효과를 25% 확률로 +1 올려${Placeholders[I.주겠네]}.`,
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
    name: `${Placeholders.OPTION} 효과를 50% 확률로 +1 올려${Placeholders[I.주겠네]}.`,
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
    name: `선택한 효과를 25% 확률로 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'potential',
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      if (Math.random() * 100 <= 25) result[optionIndex].level++;
      return result;
    },

    odds: 1,
  },

  {
    name: `선택한 효과를 50% 확률로 +1 올려${Placeholders[I.주겠네]}.`,
    type: 'potential',
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      if (Math.random() * 100 <= 50) result[optionIndex].level++;
      return result;
    },
    odds: 1,
  },
  {
    name: `${Placeholders.OPTION} 효과를 -2 ~ +2 단계 올려${Placeholders[I.주겠네]}.`,
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
    name: `${Placeholders.OPTION} 효과를 -1 ~ +2 단계 올려${Placeholders[I.주겠네]}.`,
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
    name: `선택한 효과를 -2 ~ +2 단계 올려${Placeholders[I.주겠네]}.`,
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
    name: `선택한 효과를 -1 ~ +2 단계 올려${Placeholders[I.주겠네]}.`,
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
    name: `${Placeholders.OPTION} 효과의 단계를 ${Placeholders.N_NPLUS_1} 중 하나로 변경해${Placeholders[I.주겠네]}.`,
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
    name: `선택한 효과의 단계를 ${Placeholders.OPTION} 중 하나로 변경해${Placeholders[I.주겠네]}.`,
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
    name: `${Placeholders.OPTION} 효과의 단계를 +1 올려${Placeholders[I.주겠네]}. 대신...`,
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
      return result;
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
      return result;
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
      return result;
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
    name: `연성되지 않은 모든 효과를 +1 올려${Placeholders[I.주겠네]}.`,
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
  {
    ...amplifyHitRateAdviceTemplate(100, 1),
    name: `이번 연성에서 ${Placeholders.OPTION} 효과를 연성해${Placeholders[I.주겠네]}.`,
  },
  amplifyHitRateTemporarilyAdviceTemplate(70, 1),
  amplifyHitRateTemporarilyAdviceTemplate(30, 1),
  amplifyHitRateTemporarilyAdviceTemplate(-20, 1),
  amplifyHitRateAdviceTemplate(5, 1),
  amplifyHitRateAdviceTemplate(10, 1),
  amplifyHitRateAdviceTemplate(-5, 1),
  amplifyBigHitRateAdviceTemplate(7, 1),
  amplifyBigHitRateAdviceTemplate(15, 1),
  amplifyBigHitRateTemporarilyAdviceTemplate(100, 1),
  // TODO: 템플릿 만들기
  {
    name: `내 힘을 모두 소진하겠다. 대신 네가 고르는 효과의 단계를 [0~+4] 중 하나만큼 올려주지.`,
    special: 'chaos',
    sage: '루베도',
    type: 'potential',
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      const diff = Math.floor(Math.random() * 5);
      result[optionIndex].level += diff;
      result[optionIndex].level = Math.max(Math.min(result[optionIndex].level, 100), 0);
      return result;
    },
    odds: 1,
  },
  {
    name: `내 힘을 모두 소진하겠네. 대신 자네가 선택한 효과의 단계를 [+2~+3] 중 하나만큼 올릴걸세.`,
    special: 'chaos',
    sage: '비르디타스',
    type: 'potential',
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      const diff = Math.floor(Math.random() * 5);
      result[optionIndex].level += diff;
      result[optionIndex].level = Math.max(Math.min(result[optionIndex].level, 100), 0);
      return result;
    },
    odds: 1,
  },
  {
    name: `제 힘을 모두 소진하겠어요. 대신, 당신이 택한 효과의 단계를 [-4~+5] 중 하나만큼 올려드리죠.`,
    special: 'chaos',
    sage: '치트리니',
    type: 'potential',
    effect: () => (beforeElixirs, optionIndex) => {
      const result = [...beforeElixirs];
      const diff = Math.floor(Math.random() * 10) - 4;
      result[optionIndex].level += diff;
      result[optionIndex].level = Math.max(Math.min(result[optionIndex].level, 100), 0);
      return result;
    },
    odds: 1,
  },
  {
    ...amplifySelectedHitRateAdviceTemplate(15, 1),
    special: 'order',
    sage: '루베도',
  },
  {
    ...amplifySelectedHitRateAdviceTemplate(15, 1),
    special: 'order',
    sage: '비르디타스',
  },
  {
    ...amplifySelectedHitRateAdviceTemplate(15, 1),
    special: 'order',
    sage: '치트리니',
  },
];

function amplifyHitRateTemporarilyAdviceTemplate(n: number, odds: number): Advice {
  return {
    name: `이번 연성에서 ${Placeholders.OPTION} 효과의 연성 확률을 ${Math.abs(n)}% ${n >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs: ElixirInstance[]) => {
        const result = [...beforeElixirs];
        result.forEach((option, idx) => {
          option.nextHitRate = option.hitRate;

          if (optionIndex === idx) option.hitRate += n;
          else option.hitRate -= n / (OPTION_COUNT - 1);
          option.hitRate = Math.max(Math.min(option.hitRate, 100), 0);
        });
        return result;
      },
    odds,
  };
}

function amplifyHitRateAdviceTemplate(n: number, odds: number): Advice {
  return {
    name: `남은 연성에서 ${Placeholders.OPTION} 효과의 연성 확률을 ${Math.abs(n)}% ${n >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs: ElixirInstance[]) => {
        const result = [...beforeElixirs];
        result.forEach((option, idx) => {
          if (optionIndex === idx) option.hitRate += n;
          else option.hitRate -= n / (OPTION_COUNT - 1);
          option.hitRate = Math.max(Math.min(option.hitRate, 100), 0);

          option.nextHitRate = option.hitRate;
        });
        return result;
      },
    odds,
  };
}

function amplifySelectedHitRateAdviceTemplate(n: number, odds: number): Advice {
  return {
    name: `남은 연성에서 선택한 효과의 연성 확률을 ${Math.abs(n)}% ${n >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect: () => (beforeElixirs: ElixirInstance[], optionIndex) => {
      const result = [...beforeElixirs];
      validateOptionIndex(optionIndex);
      result.forEach((option, idx) => {
        if (optionIndex === idx) option.hitRate += n;
        else option.hitRate -= n / (OPTION_COUNT - 1);
        option.hitRate = Math.max(Math.min(option.hitRate, 100), 0);

        option.nextHitRate = option.hitRate;
      });
      return result;
    },
    odds,
  };
}

function amplifyBigHitRateAdviceTemplate(n: number, odds: number): Advice {
  return {
    name: `남은 연성에서 ${Placeholders.OPTION} 효과의 대성공 확률을 ${Math.abs(n)}% ${n >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs: ElixirInstance[]) => {
        const result = [...beforeElixirs];
        result.forEach((option, idx) => {
          if (optionIndex === idx) option.bigHitRate += n;
          option.bigHitRate = Math.max(Math.min(option.bigHitRate, 100), 0);

          option.nextBigHitRate = option.bigHitRate;
        });
        return result;
      },
    odds,
  };
}

function amplifyBigHitRateTemporarilyAdviceTemplate(n: number, odds: number): Advice {
  return {
    name: `이번 연성에서 ${Placeholders.OPTION} 효과의 대성공 확률을 ${Math.abs(n)}% ${n >= 0 ? '높여' : '낮춰'}${Placeholders[I.주겠네]}.`,
    type: 'util',
    effect:
      ({ optionIndex }) =>
      (beforeElixirs: ElixirInstance[]) => {
        const result = [...beforeElixirs];
        result.forEach((option, idx) => {
          option.nextBigHitRate = option.bigHitRate;

          if (optionIndex === idx) option.bigHitRate += n;
          option.bigHitRate = Math.max(Math.min(option.bigHitRate, 100), 0);
        });
        return result;
      },
    odds,
  };
}
