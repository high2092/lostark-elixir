import styled from '@emotion/styled';
import { MODAL_DEFAULT_BORDER_RADIUS } from '../constants';

export const SettingModal = styled.div`
  width: 30vw;
  padding: 2rem;

  background-color: white;

  border-radius: ${MODAL_DEFAULT_BORDER_RADIUS};

  & > * {
    padding: 0.5rem 0;
  }
`;

export const PatchNoteOpenButton = styled.div`
  position: absolute;
  right: 2rem;

  color: #19a7ce;
  font-size: 0.8rem;

  cursor: pointer;
`;
