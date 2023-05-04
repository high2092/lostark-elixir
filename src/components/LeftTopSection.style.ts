import styled from '@emotion/styled';

export const LeftTopSection = styled.div`
  position: fixed;

  z-index: 5;

  height: 1rem;
  padding: 0.5rem;

  color: white;
  fill: white;

  display: flex;
  align-items: center;

  & > * {
    padding: 0 0.2rem;
  }
`;

export const YouTube = styled.div`
  position: fixed;
  overflow: hidden;
  width: 0;
`;

export const IconButton = styled.div<{ outline?: boolean }>`
  ${({ outline }) => (outline ? 'outline: 3px solid red;' : '')}
  cursor: pointer;
`;
