import styled from '@emotion/styled';
import { DEFAULT_BORDER_RADIUS_PX } from '../constants';

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

export const ElixirOption = styled.div<{ selected?: boolean; locked?: boolean }>`
  width: 23vw;
  height: 9vh;

  background-color: ${({ locked }) => (locked ? '#999999' : '#c8b6a6')};

  margin: 1.5rem;

  ${({ selected }) => (selected ? 'outline: 3px solid #FF8400;' : '')}

  border-radius: 2rem ${DEFAULT_BORDER_RADIUS_PX}px ${DEFAULT_BORDER_RADIUS_PX}px 2rem;

  display: flex;
  align-content: center;
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

export const FirstVisitHelpText = styled.div`
  position: fixed;
  color: red;

  top: 2rem;
  left: 0.2rem;

  width: 12rem;

  word-break: keep-all;
  font-family: 'Poor Story', cursive;
`;
