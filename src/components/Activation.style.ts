import styled from '@emotion/styled';
import { CENTERED_FLEX_STYLE, MAX_ACTIVE, MOBILE_CRITERIA_MAX_WIDTH } from '../constants';

export const ANIMATION_DURATION_SECOND = 1;
const ACTIVATION_WIDTH_REM = 15;
const ACTIVATION_WIDTH_REM_MOBILE = 13;

const BORDER_WIDTH_PX = 3;
export const Activation = styled.div<{ percentage: number }>`
  position: relative;

  width: ${ACTIVATION_WIDTH_REM}rem;
  height: ${ACTIVATION_WIDTH_REM / MAX_ACTIVE}rem;

  background-color: transparent;

  overflow: hidden;

  display: flex;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: ${ACTIVATION_WIDTH_REM / MAX_ACTIVE}rem;
    background-color: #ffd966;
    transition: left 1s;
    left: -${({ percentage }) => ACTIVATION_WIDTH_REM * (1 - percentage)}rem;
  }

  div {
    z-index: 10;
    flex: 1;
    width: 10px;

    border: solid ${BORDER_WIDTH_PX}px;
    border-right: solid ${BORDER_WIDTH_PX / 2}px black;
    border-left: solid ${BORDER_WIDTH_PX / 2}px black;
    font-size: 0.8rem;

    ${CENTERED_FLEX_STYLE};
  }

  div:nth-of-type(1) {
    border-left: solid ${BORDER_WIDTH_PX}px black;
  }

  div:nth-last-of-type(1) {
    border-right: solid ${BORDER_WIDTH_PX}px black;
  }

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    width: ${ACTIVATION_WIDTH_REM_MOBILE}rem;
    height: ${ACTIVATION_WIDTH_REM_MOBILE / MAX_ACTIVE}rem;
    &::before {
      left: -${({ percentage }) => ACTIVATION_WIDTH_REM_MOBILE * (1 - percentage)}rem;
    }
  }
`;
