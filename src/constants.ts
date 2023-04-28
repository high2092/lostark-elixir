import { css } from '@emotion/react';

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

// TODO: enum
export const FullStack = {
  chaos: 6,
  order: 3,
} as const;
