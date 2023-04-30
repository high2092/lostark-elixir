import styled from '@emotion/styled';
import { SageTypesType } from '../type/sage';
import { DEFAULT_BORDER_RADIUS_PX, STACK_COUNTER_EXPECTED_HEIGHT, SageTypes } from '../constants';

const ADVICE_SECTION_WIDTH_VW = 75;
const ADVICE_REROLL_BUTTON_WIDTH_REM = 14;
const ADVICE_REROLL_BUTTON_MARGIN_LEFT_REM = 10.5 - ADVICE_REROLL_BUTTON_WIDTH_REM / 2;

export const AdviceSection = styled.div`
  position: absolute;

  width: ${ADVICE_SECTION_WIDTH_VW}vw;

  bottom: 0;
  left: 50%;
  transform: translateX(calc(-50% + ${(ADVICE_REROLL_BUTTON_WIDTH_REM + ADVICE_REROLL_BUTTON_MARGIN_LEFT_REM) / 2}rem));

  display: flex;
  align-items: center;
`;

const ADVICE_MARGIN_REM = 0.6;

export const AdviceDialogue = styled.div<{ disabled: boolean; special: SageTypesType; selected: boolean }>`
  background-color: ${({ disabled }) => (disabled ? 'grey' : 'beige')};

  width: 80%;
  height: 4.5rem;
  padding: 0 10%;

  ${({ selected }) => (selected ? 'outline: 3px solid #FF8400;' : '')}
  ${({ special, disabled }) => (special && !disabled ? `box-shadow: 0 0 20px 5px ${SageTypes[special].color};` : '')}

  border-radius: ${DEFAULT_BORDER_RADIUS_PX}px;
  font-size: 0.8rem;
  word-break: keep-all;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;
`;

export const Advice = styled.div`
  flex: 1;

  margin: ${ADVICE_MARGIN_REM}rem ${ADVICE_MARGIN_REM / 2}rem;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ADVICE_REROLL_BUTTON_FLEX_RATIO = 1;
export const AdviceRerollButton = styled.div<{ disabled: boolean }>`
  flex: ${ADVICE_REROLL_BUTTON_FLEX_RATIO};
  height: 3.5rem;

  margin-top: ${STACK_COUNTER_EXPECTED_HEIGHT};

  margin-left: ${ADVICE_SECTION_WIDTH_VW / 20 - 1 * ADVICE_REROLL_BUTTON_FLEX_RATIO}vw;

  background-color: ${({ disabled }) => (disabled ? '#999999' : 'orange')};

  display: flex;
  justify-content: center;
  align-items: center;
`;
