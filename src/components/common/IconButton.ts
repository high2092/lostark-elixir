import styled from '@emotion/styled';

export const IconButton = styled.div<{ outline?: boolean }>`
  ${({ outline }) => (outline ? 'outline: 3px solid red;' : '')}
  cursor: pointer;
`;
