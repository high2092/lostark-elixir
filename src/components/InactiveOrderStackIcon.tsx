import { SAGE_TYPE_STACK_SIZE, SageTypes } from '../constants';
import { SageTypesTypes } from '../type/sage';

export const InactiveOrderStackIcon = () => {
  return (
    <svg width={SAGE_TYPE_STACK_SIZE} height={SAGE_TYPE_STACK_SIZE} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path
        fill={SageTypes[SageTypesTypes.ORDER].color}
        fillRule="evenodd"
        d="M7.468 1.813L1.81 7.47a.75.75 0 000 1.06l5.657 5.657a.75.75 0 001.06 0l5.657-5.656a.75.75 0 000-1.061L8.528 1.813a.75.75 0 00-1.06 0zM.75 6.41L6.407.753a2.25 2.25 0 013.182 0l5.657 5.656a2.25 2.25 0 010 3.182l-5.657 5.657a2.25 2.25 0 01-3.182 0L.75 9.591a2.25 2.25 0 010-3.182z"
        clipRule="evenodd"
      />
    </svg>
  );
};
