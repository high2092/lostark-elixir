import styled from '@emotion/styled';
import { SageTypesType } from '../type/sage';
import { DEFAULT_BORDER_RADIUS_PX, MOBILE_CRITERIA_MAX_WIDTH, SageTypes } from '../constants';

const ADVICE_SECTION_WIDTH_VW = 75;

const ADVICE_HEIGHT = '4.5rem';
const ADVICE_MARGIN = '0.5rem';

export const AdviceSection = styled.div`
  position: absolute;

  width: ${ADVICE_SECTION_WIDTH_VW}vw;

  bottom: ${ADVICE_MARGIN};
  left: 50%;
  transform: translateX(calc(-37.5%)); // [25] [12.5 (요기) 12.5] [25] // [25]
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  font-size: 0.8rem;
  text-align: center;
  word-break: keep-all;
`;

export const Advice = styled.div<{ disabled: boolean; special: SageTypesType; selected: boolean }>`
  background-color: ${({ disabled }) => (disabled ? 'grey' : 'beige')};

  width: calc(100% - ${ADVICE_MARGIN});
  height: ${ADVICE_HEIGHT};

  ${({ selected }) => (selected ? 'outline: 3px solid #FF8400;' : '')}
  ${({ special, disabled }) => (special && !disabled ? `box-shadow: 0 0 20px 5px ${SageTypes[special].color};` : '')}

  border-radius: ${DEFAULT_BORDER_RADIUS_PX}px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.1;

  & > * {
    padding: 10%;
  }
`;

export const AdviceContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const AdviceRerollButton = styled.div<{ disabled: boolean }>`
  margin-left: 10%;
  width: 80%;
  height: calc(${ADVICE_HEIGHT} * 0.8);

  background-color: ${({ disabled }) => (disabled ? '#999999' : 'orange')};
  border-radius: ${DEFAULT_BORDER_RADIUS_PX}px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
