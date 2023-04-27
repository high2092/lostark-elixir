import styled from '@emotion/styled';
import { CENTERED_FLEX_STYLE, MAX_ACTIVE } from '../constants';

export const ANIMATION_DURATION_SECOND = 1;
const ACTIVATION_WIDTH_PX = 240;
const BORDER_WIDTH_PX = 3;
export const Activation = styled.div<{ percentage: number }>`
  position: relative;

  width: ${ACTIVATION_WIDTH_PX}px;
  height: ${ACTIVATION_WIDTH_PX / MAX_ACTIVE}px;
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
    height: ${ACTIVATION_WIDTH_PX / MAX_ACTIVE}px;
    background-color: #ffd966;
    transition: left 1s;
    left: -${({ percentage }) => ACTIVATION_WIDTH_PX * (1 - percentage)}px;
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

  div:nth-child(1) {
    border-left: solid ${BORDER_WIDTH_PX}px black;
  }

  div:nth-last-child(1) {
    border-right: solid ${BORDER_WIDTH_PX}px black;
  }
`;
