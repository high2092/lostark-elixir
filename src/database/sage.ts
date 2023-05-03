import { SageKeys, SageTemplate } from '../type/sage';

export const SageTemplates: {
  [key: string]: SageTemplate;
} = {
  [SageKeys.L]: {
    name: '루베도',
    dialogueEnds: {
      어떤가: '어때',
      주겠네: '주지',
      올릴걸세: '올려주지',
      내: '내',
      하겠네: '하겠다',
      자네가: '네가',
      선택한: '고르는',
      할걸세: '할거야',
      않을걸세: '않을거야',
    },
  },

  [SageKeys.B]: {
    name: '비르디타스',
    dialogueEnds: {
      어떤가: '어떤가',
      주겠네: '주겠네',
      올릴걸세: '올릴걸세',
      내: '내',
      하겠네: '하겠네',
      자네가: '자네가',
      선택한: '선택한',
      할걸세: '할걸세',
      않을걸세: '않을걸세',
    },
  },

  [SageKeys.C]: {
    name: '치트리니',
    dialogueEnds: {
      어떤가: '어때요',
      주겠네: '드리죠',
      올릴걸세: '올려드리죠',
      내: '제',
      하겠네: '하겠어요',
      자네가: '당신이',
      선택한: '택한',
      할걸세: '할거예요',
      않을걸세: '않을거예요',
    },
  },
};
