import { css } from '@emotion/react';
import { SageTypesTypes } from './type/sage';

export const OPTION_COUNT = 5;
export const ADVICE_COUNT = 3;
export const ALCHEMY_CHANCE = 12;
export const MAX_ACTIVE = 10;

export const CENTERED_FLEX_STYLE = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DEFAULT_BORDER_RADIUS_PX = 2;

export const SageTypes = {
  [SageTypesTypes.CHAOS]: {
    displayName: '혼돈',
    fullStack: 6,
    color: 'purple',
  },
  [SageTypesTypes.ORDER]: {
    displayName: '질서',
    fullStack: 3,
    color: 'blue',
  },
};
export const DIALOGUE_END_INDEX = {
  어떤가: 0,
  주겠네: 1,
  올릴걸세: 2,
  내: 3,
  하겠네: 4,
  자네: 5,
  선택한: 6,
  할걸세: 7,
};

export const Placeholders = {
  OPTION: '?{option}',
  N: '?{n}',
  N_NPLUS_1: '?{[n~n+1]}',
  [DIALOGUE_END_INDEX.어떤가]: '?{어떤가}',
  [DIALOGUE_END_INDEX.주겠네]: '?{주겠네}',
  [DIALOGUE_END_INDEX.올릴걸세]: '?{올릴걸세}',
  [DIALOGUE_END_INDEX.내]: '?{내}',
  [DIALOGUE_END_INDEX.하겠네]: '?{하겠네}',
  [DIALOGUE_END_INDEX.자네]: '?{자네}',
  [DIALOGUE_END_INDEX.선택한]: '?{선택한}',
  [DIALOGUE_END_INDEX.할걸세]: '?{할걸세}',
};

export const SAGE_TYPE_STACK_SIZE = '1.4vw';
export const STACK_COUNTER_EXPECTED_HEIGHT = '3vw';

export const DEFAULT_ADVICE_REROLL_CHANCE = 2;
