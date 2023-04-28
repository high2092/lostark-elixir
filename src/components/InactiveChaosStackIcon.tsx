import { SageTypes } from '../constants';
import { SageTypesTypes } from '../type/sage';

export const InactiveChaosStackIcon = () => {
  return (
    <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path fill={SageTypes[SageTypesTypes.CHAOS].color} fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" clip-rule="evenodd" />
    </svg>
  );
};
