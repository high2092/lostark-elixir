import styled from '@emotion/styled';

export const LeftTopSection = styled.div<{ outline: boolean }>`
  position: fixed;

  height: 1rem;
  padding: 0.5rem;

  ${({ outline }) => (outline ? 'outline: 3px solid red;' : '')}

  color: white;
  fill: white;

  display: flex;
  align-items: center;

  & > * {
    padding: 0 0.1rem;
  }
`;

export const YouTube = styled.div`
  position: fixed;
  overflow: hidden;
  width: 0;
`;

export const BGMPlayer = styled.div`
  display: flex;
  align-items: center;
`;

export const PlayButton = styled.div`
  padding: 0rem 0.2rem;
  cursor: pointer;
`;

export const ResetButton = styled.div`
  cursor: pointer;
`;
