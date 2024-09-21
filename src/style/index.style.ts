import styled from '@emotion/styled';
import { DEFAULT_BORDER_RADIUS_PX, MEDIA_PC, MOBILE_CRITERIA_MAX_WIDTH } from '../constants';

export const Home = styled.div<{ downsizeHeight: boolean }>`
  width: 100vw;
  height: 100vh;

  background-color: grey;

  display: flex;
  flex-direction: column;

  user-select: none;

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    ${({ downsizeHeight }) => (downsizeHeight ? 'height: 83vh;' : '')}
    * {
      font-size: 0.6rem;
    }
  }
`;

const ELIXIR_OPTION_HEIGHT = '9vh';
const ELIXIR_OPTION_HEIGHT_MOBILE = '6.66vh';
const ELIXIR_OPTION_SECTION_TOP_FACTOR = 3.6;
export const ElixirOptionSection = styled.div<{ downsizeHeight: boolean }>`
  position: absolute;

  z-index: 1;

  top: calc(${ELIXIR_OPTION_HEIGHT} * ${ELIXIR_OPTION_SECTION_TOP_FACTOR});
  right: 0;

  transform: translateY(-50%);

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    ${({ downsizeHeight }) => (downsizeHeight ? `top: calc(${ELIXIR_OPTION_HEIGHT_MOBILE} * ${ELIXIR_OPTION_SECTION_TOP_FACTOR});` : '')}
  }
`;

export const ElixirOption = styled.div<{ selected?: boolean; locked?: boolean; downsizeHeight: boolean }>`
  width: 21rem;
  height: ${ELIXIR_OPTION_HEIGHT};

  background-color: ${({ locked }) => (locked ? '#999999' : '#c8b6a6')};

  margin: 3vh;

  ${({ selected }) => (selected ? 'outline: 3px solid #FF8400;' : '')}

  border-radius: 2rem ${DEFAULT_BORDER_RADIUS_PX}px ${DEFAULT_BORDER_RADIUS_PX}px 2rem;

  display: flex;
  align-content: center;

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    width: 18rem;
    ${({ downsizeHeight }) => (downsizeHeight ? `height: ${ELIXIR_OPTION_HEIGHT_MOBILE};` : '')}
  }
`;

export const MainSection = styled.div<{ hideBackgroundImage: boolean }>`
  position: relative;

  top: 0;
  left: 0;

  width: 100%;
  height: 77%;

  background: ${({ hideBackgroundImage }) => (hideBackgroundImage ? '#333333' : `url('image/background.webp')`)};
  background-size: cover;
  background-position: center center;

  ${MEDIA_PC} {
    height: 73%;
  }
`;

export const DescriptionSection = styled.div`
  width: 100%;
  flex-grow: 1;

  background-color: #a4907c;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const DescriptionSSection = styled.div`
  flex: 5;
  width: 60%;

  text-align: center;

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    width: 100%;
  }
`;

export const MaterialSection = styled.div`
  width: 60%;
  /* height: 60%; */
  text-align: center;

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    width: 100%;
  }
`;

export const MaterialSectionText = styled.div`
  height: 1rem;
`;

export const MaterialInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 100%;
`;

const MATERIAL_INFO_SUB_SECTION_PADDING_VERTICAL = '1rem';
export const MaterialInfoSubSection = styled.div`
  flex: 1;
  height: calc(100% - ${MATERIAL_INFO_SUB_SECTION_PADDING_VERTICAL});

  padding: ${MATERIAL_INFO_SUB_SECTION_PADDING_VERTICAL} 2rem;

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

  z-index: 5;

  color: red;

  word-break: keep-all;
  font-family: 'Poor Story', cursive;
  font-weight: bold;
`;
