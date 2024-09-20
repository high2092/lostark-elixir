import styled from '@emotion/styled';
import { MEDIA_PC } from '../constants';
import { IconButton } from './common/IconButton';

export const LeftTopSection = styled.div`
  position: fixed;

  z-index: 5;

  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.2);

  color: white;
  fill: white;

  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 0.6rem;

  ${MEDIA_PC} {
    flex-direction: row;
  }
`;

export const PlayButton = styled(IconButton)`
  ${MEDIA_PC} {
    order: -1;
  }
`;

export const YouTube = styled.div`
  position: fixed;
  overflow: hidden;
  width: 0;
`;
