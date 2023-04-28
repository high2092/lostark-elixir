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

export const playRefineSuccessSound = () => new Audio('/sound/refine-success.mp3').play();
export const playRefineFailureSound = () => new Audio('/sound/refine-failure.mp3').play();

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
};

export const Placeholders = {
  OPTION: '?{option}',
  N: '?{n}',
  N_NPLUS_1: '?{[n~n+1]}',
  [DIALOGUE_END_INDEX.어떤가]: '?{어떤가}',
  [DIALOGUE_END_INDEX.주겠네]: '?{주겠네}',
};
