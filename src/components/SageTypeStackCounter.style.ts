import styled from '@emotion/styled';

export const SageTypeStackCounter = styled.div<{ blank?: boolean }>`
  padding: 0.5vw;

  ${({ blank }) => (!blank ? `background-color: rgba(255, 255, 255, 0.2)` : '')};

  border-radius: 1rem;

  display: flex;
  align-items: center;
  gap: 0.5vw;
`;
