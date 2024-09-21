import styled from '@emotion/styled';
import { MODAL_DEFAULT_BORDER_RADIUS } from '../constants';
import { css } from '@emotion/react';
import { AnchorStyle } from '../style/common';

export const SettingModal = styled.div`
  width: max-content;
  padding: 2rem;
  background-color: white;

  border-radius: ${MODAL_DEFAULT_BORDER_RADIUS};

  user-select: none;

  & > div {
    padding: 0.5rem 0;
  }
`;

export const PatchNoteOpenButton = styled.div`
  position: absolute;
  right: 2rem;

  ${AnchorStyle};
`;
