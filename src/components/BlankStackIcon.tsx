import { SAGE_TYPE_STACK_SIZE } from '../constants';

export const BlankIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={SAGE_TYPE_STACK_SIZE} height={SAGE_TYPE_STACK_SIZE}>
      <path fill="none" stroke="#999" strokeWidth="2" d="M1,1V199H199V1z" />
    </svg>
  );
};
