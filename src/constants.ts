import { css } from '@emotion/react';
import { SageTypesTypes, DialogueEndTypes as D, DialogueEndTypes } from './type/sage';
import { AlchemyStatuses } from './type/common';

export const OPTION_COUNT = 5;
export const FINAL_OPTION_COUNT = 2;
export const ADVICE_COUNT = 3;

export const ALCHEMY_CHANCE = 14;
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

type Placeholders = {
  [key in DialogueEndTypes | 'OPTION' | 'SUB_OPTION']: string;
};

export const Placeholders: Placeholders = {
  OPTION: '?{option}',
  SUB_OPTION: '?{subOption}',
  어떤가: '?{어떤가}',
  주겠네: '?{주겠네}',
  올릴걸세: '?{올릴걸세}',
  내: '?{내}',
  하겠네: '?{하겠네}',
  자네가: '?{자네가}',
  선택한: '?{선택한}',
  할걸세: '?{할걸세}',
  않을걸세: '?{않을걸세}',
  바라네: '?{바라네}',
  흐름이좋지않군: '?{흐름이좋지않군}',
  하겠네2: '?{하겠네2}',
};

export const SAGE_TYPE_STACK_SIZE = '1.4vw';
export const STACK_COUNTER_EXPECTED_HEIGHT = '3vw';

export const DEFAULT_ADVICE_REROLL_CHANCE = 2;

export const DEFAULT_ICON_SIZE = '1.3rem';

export const AUDIO_RESOURCE_URL_LIST = ['/sound/refine-success.mp3', '/sound/refine-failure.mp3', '/sound/click.mp3'];
export const IMAGE_RESOURCE_URL_LIST = [
  '/image/background.webp',
  '/image/gold.png',
  '/image/material.png',
  '/image/pwa-help/ios/1.png',
  '/image/pwa-help/ios/2.png',
  '/image/pwa-help/ios/3.png',
  '/image/pwa-help/android/1.png',
  '/image/pwa-help/android/2.png',
  '/image/pwa-help/pc/1.webp',
  '/image/pwa-help/pc/2.webp',
];

export const VISITED_COOKIE_KEY = 'LOSTARK_ELIXIR_VISITED';

export const ButtonTexts = {
  [AlchemyStatuses.REFINE]: '효과 정제',
  [AlchemyStatuses.ADVICE]: '조언 선택',
  [AlchemyStatuses.ALCHEMY]: '연성하기',
  [AlchemyStatuses.COMPLETE]: '연성 완료',
};

export const REFINE_DESCRIPTION_TEXT = '엘릭서에 정제할 효과를 위 항목에서 선택하세요.';

export const DEFAULT_BIG_HIT_RATE_PERCENT = 10;

export const TutorialStatus = {
  PLAY_BGM: 1,
  RESET: 2,
  OPEN_INVENTORY: 3,
};

export const TUTORIALS = [TutorialStatus.PLAY_BGM, TutorialStatus.RESET, TutorialStatus.OPEN_INVENTORY];

export const TutorialTexts = {
  [TutorialStatus.PLAY_BGM]: '배경음악 ON/OFF 버튼이에요.',
  [TutorialStatus.RESET]: '연성 상태 초기화 버튼이에요.',
  [TutorialStatus.OPEN_INVENTORY]: '누적 연성 결과 확인 버튼이에요.',
};

export const MOBILE_CRITERIA_MAX_WIDTH = '768px';

export const INITIAL_MATERIAL = {
  GOLD: 5600000,
  CATALYST: 100000,
};

export const COST_PER_ALCHEMY = {
  GOLD: 140,
  CATALYST: 3,
};

export const MODAL_DEFAULT_BORDER_RADIUS = '2rem';

export const ELIXIR_ICON_SIZE = '4vh';
