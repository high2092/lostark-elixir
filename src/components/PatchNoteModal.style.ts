import styled from '@emotion/styled';
import { MODAL_DEFAULT_BORDER_RADIUS } from '../constants';

export const PatchNoteModal = styled.div`
  padding: 2rem;

  background-color: white;

  border-radius: ${MODAL_DEFAULT_BORDER_RADIUS};
`;

export const PatchNoteTitle = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
`;

export const PatchNote = styled.div`
  width: 60vw;
  max-height: 60vh;

  padding: 1rem 0;

  overflow: scroll;
`;

export const Patch = styled.div`
  padding: 0.2rem 0;
`;

export const PatchDate = styled.div`
  padding: 1rem 0;

  font-size: 1.1rem;
`;

export const PatchDetail = styled.div`
  padding: 0.3rem;

  font-size: 0.9rem;

  display: flex;
`;

export const PatchDetailTime = styled.div`
  padding-right: 1rem;

  width: 5.2rem;

  display: flex;
  justify-content: space-between;
`;

export const PatchDetailDescription = styled.div`
  flex: 6;
`;
