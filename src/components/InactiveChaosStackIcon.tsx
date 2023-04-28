import { SAGE_TYPE_STACK_SIZE, SageTypes } from '../constants';
import { SageTypesTypes } from '../type/sage';

export const InactiveChaosStackIcon = () => {
  return (
    <svg width={SAGE_TYPE_STACK_SIZE} height={SAGE_TYPE_STACK_SIZE} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path fill={SageTypes[SageTypesTypes.CHAOS].color} fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" clipRule="evenodd" />
    </svg>
  );
};
