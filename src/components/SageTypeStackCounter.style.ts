import styled from '@emotion/styled';

const GAP = '0.6vw';

export const SageTypeStackCounter = styled.div<{ blank?: boolean }>`
  padding: ${GAP};
  margin-bottom: 4px;

  ${({ blank }) => (!blank ? `background-color: rgba(0, 0, 0, 0.3)` : '')};

  border-radius: 1rem;

  display: flex;
  align-items: center;
  gap: ${GAP};
`;
