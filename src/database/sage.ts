import { DIALOGUE_END_INDEX as I } from '../constants';
import { SageKeys, SageTemplate } from '../type/sage';

export const SageTemplates: {
  [key: string]: SageTemplate;
} = {
  [SageKeys.L]: {
    name: '루베도',
    dialogueEnds: {
      [I.어떤가]: '어때',
      [I.주겠네]: '주지',
      [I.올릴걸세]: '올려주지',
      [I.내]: '내',
      [I.하겠네]: '하겠다',
      [I.자네]: '네',
      [I.선택한]: '고르는',
      [I.할걸세]: '할거야',
      [I.않을걸세]: '않을거야',
    },
  },

  [SageKeys.B]: {
    name: '비르디타스',
    dialogueEnds: {
      [I.어떤가]: '어떤가',
      [I.주겠네]: '주겠네',
      [I.올릴걸세]: '올릴걸세',
      [I.내]: '내',
      [I.하겠네]: '하겠네',
      [I.자네]: '자네',
      [I.선택한]: '선택한',
      [I.할걸세]: '할걸세',
      [I.않을걸세]: '않을걸세',
    },
  },

  [SageKeys.C]: {
    name: '치트리니',
    dialogueEnds: {
      [I.어떤가]: '어때요',
      [I.주겠네]: '드리죠',
      [I.올릴걸세]: '올려드리죠',
      [I.내]: '제',
      [I.하겠네]: '하겠어요',
      [I.자네]: '당신이',
      [I.선택한]: '택한',
      [I.할걸세]: '할거예요',
      [I.않을걸세]: '않을거예요',
    },
  },
};
