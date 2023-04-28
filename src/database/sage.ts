import { DIALOGUE_END_INDEX } from '../constants';
import { SageTemplate } from '../type/sage';

export const SageKeys = {
  L: '루베도',
  B: '비르디타스',
  C: '치트리니',
} as const;

export const SageTemplates: {
  [key: string]: SageTemplate;
} = {
  [SageKeys.L]: {
    name: '루베도',
    dialogueEnds: {
      [DIALOGUE_END_INDEX.어떤가]: '어때',
      [DIALOGUE_END_INDEX.주겠네]: '주지',
    },
  },

  [SageKeys.B]: {
    name: '비르디타스',
    dialogueEnds: {
      [DIALOGUE_END_INDEX.어떤가]: '어떤가',
      [DIALOGUE_END_INDEX.주겠네]: '주겠네',
    },
  },

  [SageKeys.C]: {
    name: '치트리니',
    dialogueEnds: {
      [DIALOGUE_END_INDEX.어떤가]: '어때요',
      [DIALOGUE_END_INDEX.주겠네]: '드리죠',
    },
  },
};
