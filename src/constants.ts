import { css } from '@emotion/react';
import { SageTypesTypes } from './type/sage';
import { AlchemyStatuses } from './type/common';

export const OPTION_COUNT = 5;
export const FINAL_OPTION_COUNT = 2;
export const ADVICE_COUNT = 3;

export const ALCHEMY_CHANCE = 15;
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
  자네가: 5,
  선택한: 6,
  할걸세: 7,
  않을걸세: 8,
};

export const Placeholders = {
  OPTION: '?{option}',
  SUB_OPTION: '?{subOption}',
  [DIALOGUE_END_INDEX.어떤가]: '?{어떤가}',
  [DIALOGUE_END_INDEX.주겠네]: '?{주겠네}',
  [DIALOGUE_END_INDEX.올릴걸세]: '?{올릴걸세}',
  [DIALOGUE_END_INDEX.내]: '?{내}',
  [DIALOGUE_END_INDEX.하겠네]: '?{하겠네}',
  [DIALOGUE_END_INDEX.자네가]: '?{자네가}',
  [DIALOGUE_END_INDEX.선택한]: '?{선택한}',
  [DIALOGUE_END_INDEX.할걸세]: '?{할걸세}',
  [DIALOGUE_END_INDEX.않을걸세]: '?{않을걸세}',
};

export const SAGE_TYPE_STACK_SIZE = '1.4vw';
export const STACK_COUNTER_EXPECTED_HEIGHT = '3vw';

export const DEFAULT_ADVICE_REROLL_CHANCE = 2;

export const PLAY_PAUSE_ICON_SIZE = '1rem';

export const AUDIO_RESOURCE_URL_LIST = ['/sound/refine-success.mp3', '/sound/refine-failure.mp3', '/sound/click.mp3'];
export const IMAGE_RESOURCE_URL_LIST = ['/image/background.png', '/image/gold.png', '/image/material.png'];

export const VISITED_COOKIE_KEY = 'LOSTARK_ELIXIR_VISITED';

export const ButtonTexts = {
  [AlchemyStatuses.REFINE]: '효과 정제',
  [AlchemyStatuses.ADVICE]: '조언 선택',
  [AlchemyStatuses.ALCHEMY]: '연성하기',
  [AlchemyStatuses.COMPLETE]: '연성 완료',
};

export const MaterialSectionText = {
  SELECT_OPTION: '엘릭서에 정제할 효과를 위 항목에서 선택하세요.',
};

export const DEFAULT_BIG_HIT_RATE_PERCENT = 10;

export const TutorialStatus = {
  PLAY_BGM: 1,
  RESET: 2,
};

export const TUTORIALS = [TutorialStatus.PLAY_BGM, TutorialStatus.RESET];

export const TutorialTexts = {
  [TutorialStatus.PLAY_BGM]: '좌측 상단의 버튼을 클릭해 BGM을 켜거나 끌 수 있어요.',
  [TutorialStatus.RESET]: '좌측 상단의 버튼을 클릭해 연성 상태를 초기화할 수 있어요.',
};

export const MOBILE_CRITERIA_MAX_WIDTH = '600px';
