import { SAGE_TYPE_STACK_SIZE, SageTypes } from '../constants';
import { SageTypesTypes } from '../type/sage';

export const ActiveOrderStackIcon = () => {
  return (
    <svg width={SAGE_TYPE_STACK_SIZE} height={SAGE_TYPE_STACK_SIZE} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path fill={SageTypes[SageTypesTypes.ORDER].color} d="M6.407.753L.75 6.409a2.25 2.25 0 000 3.182l5.657 5.657a2.25 2.25 0 003.182 0l5.657-5.657a2.25 2.25 0 000-3.182L9.589.753a2.25 2.25 0 00-3.182 0z" />
    </svg>
  );
};
