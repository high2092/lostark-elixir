import styled from '@emotion/styled';

const ADVICE_REROLL_BUTTON_WIDTH_REM = 14;
const ADVICE_REROLL_BUTTON_MARGIN_LEFT_REM = 10.5 - ADVICE_REROLL_BUTTON_WIDTH_REM / 2;

export const Home = styled.div`
  width: 100vw;
  height: 100vh;

  background-color: grey;

  display: flex;
  flex-direction: column;
`;

export const ElixirOptionSection = styled.div`
  position: absolute;

  top: 45%;
  right: 0;

  transform: translateY(-50%);
`;

export const ElixirOption = styled.div`
  width: 23vw;
  height: 5rem;

  background-color: blueviolet;

  margin: 1.5rem;
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
export const Advice = styled.div`
  flex: 1;
  height: 4.5rem;

  background-color: beige;

  margin: ${ADVICE_MARGIN_REM}rem ${ADVICE_MARGIN_REM / 2}rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ADVICE_REROLL_BUTTON_FLEX_RATIO = 1;
export const AdviceRerollButton = styled.div`
  flex: ${ADVICE_REROLL_BUTTON_FLEX_RATIO};
  height: 3.5rem;

  margin-left: ${ADVICE_SECTION_WIDTH_VW / 20 - 1 * ADVICE_REROLL_BUTTON_FLEX_RATIO}vw;

  background-color: orange;

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

  background-color: blue;
`;

export const DescriptionSection = styled.div`
  width: 100%;
  height: 25%;

  background-color: red;

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

export const RefineButton = styled.div`
  padding: 0.7rem 2.1rem;

  background-color: aliceblue;
`;

export const VerticalRule = styled.div<{ height?: string }>`
  border-left: 1px solid black;

  height: ${({ height }) => height ?? '10px'};
`;

export const Material = styled.div`
  display: flex;
  align-items: center;
`;
