import { SageTypes } from '../constants';
import { SageTypesTypes } from '../type/sage';

export const ActiveChaosStackIcon = () => {
  return (
    <svg fill={SageTypes[SageTypesTypes.CHAOS].color} width="20px" height="20px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" />
    </svg>
  );
};
