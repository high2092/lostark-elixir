import styled from '@emotion/styled';
import { DEFAULT_BORDER_RADIUS_PX, STACK_COUNTER_EXPECTED_HEIGHT, SageTypes } from '../constants';
import { SageTypesType } from '../type/sage';

const ADVICE_REROLL_BUTTON_WIDTH_REM = 14;
const ADVICE_REROLL_BUTTON_MARGIN_LEFT_REM = 10.5 - ADVICE_REROLL_BUTTON_WIDTH_REM / 2;

export const Home = styled.div`
  width: 100vw;
  height: 100vh;

  background-color: grey;

  display: flex;
  flex-direction: column;

  user-select: none;
`;

export const ElixirOptionSection = styled.div`
  position: absolute;

  top: 45%;
  right: 0;

  transform: translateY(-50%);
`;

export const ElixirOption = styled.div<{ selected?: boolean }>`
  width: 23vw;
  height: 9vh;

  background-color: #c8b6a6;

  margin: 1.5rem;

  ${({ selected }) => (selected ? 'outline: 3px solid #FF8400;' : '')}

  border-radius: 2rem ${DEFAULT_BORDER_RADIUS_PX}px ${DEFAULT_BORDER_RADIUS_PX}px 2rem;

  display: flex;
  align-content: center;
`;

const ADVICE_SECTION_WIDTH_VW = 75;
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
  ${({ special }) => (special ? `box-shadow: 0 0 20px 5px ${SageTypes[special].color};` : '')}

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

export const MainSection = styled.div`
  position: relative;

  top: 0;
  left: 0;

  width: 100%;
  height: 80%;

  background: url('image/background.png');
  background-size: cover;
`;

export const DescriptionSection = styled.div`
  width: 100%;
  height: 25%;

  background-color: #a4907c;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const MaterialSection = styled.div`
  width: max-content;

  text-align: center;
`;

export const MaterialSectionText = styled.div``;

export const MaterialInfo = styled.div`
  padding: 0.5rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MATERIAL_INFO_SUB_SECTION_WIDTH_REM = 20;

export const MaterialInfoSubSection = styled.div`
  width: ${MATERIAL_INFO_SUB_SECTION_WIDTH_REM}rem;

  padding: 0.5rem;

  text-align: initial;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const RefineButton = styled.div<{ disabled: boolean }>`
  padding: 0.7rem 2.1rem;

  background-color: ${({ disabled }) => (disabled ? 'grey' : 'aliceblue')};
`;

export const VerticalRule = styled.div<{ height?: string }>`
  border-left: 1px solid black;

  height: ${({ height }) => height ?? '10px'};
`;

export const Material = styled.div`
  display: flex;
  align-items: center;
`;
