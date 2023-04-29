import styled from '@emotion/styled';

export const BGMPlayer = styled.div<{ outline: boolean }>`
  position: fixed;

  height: 1rem;
  padding: 0.3rem;
  margin: 0.2rem;

  ${({ outline }) => (outline ? 'outline: 3px solid red;' : '')}

  color: white;
  fill: white;

  display: flex;
  align-items: center;
`;

export const YouTube = styled.div`
  /* position: fixed; */
  overflow: hidden;
  width: 0;
`;

export const PlayButton = styled.div`
  padding: 0rem 0.2rem;
`;
