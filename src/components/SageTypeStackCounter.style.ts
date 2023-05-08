import styled from '@emotion/styled';

export const SageTypeStackCounter = styled.div<{ blank?: boolean }>`
  padding: 0.5vw 0;

  ${({ blank }) => (!blank ? `background-color: rgba(255, 255, 255, 0.2)` : '')};

  border-radius: 1rem;

  display: flex;
  align-items: center;

  & > * {
    padding: 0 0.5vw;
  }
`;
