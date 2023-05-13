import styled from '@emotion/styled';
import { MODAL_DEFAULT_BORDER_RADIUS } from '../constants';

export const PWAHelpModal = styled.div`
  padding: 2rem;

  background-color: white;

  border-radius: ${MODAL_DEFAULT_BORDER_RADIUS};

  user-select: none;
`;

export const Image = styled.img`
  width: auto;
  height: 80vh;
`;
