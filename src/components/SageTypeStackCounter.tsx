import * as S from './SageTypeStackCounter.style';
import { SageTypes } from '../constants';
import { SageTypesType, SageTypesTypes } from '../type/sage';
import { getStackForDisplaying } from '../util';
import { ActiveChaosStackIcon } from './ActiveChaosStackIcon';
import { ActiveOrderStackIcon } from './ActiveOrderStackIcon';
import { InactiveChaosStackIcon } from './InactiveChaosStackIcon';
import { InactiveOrderStackIcon } from './InactiveOrderStackIcon';

interface SageTypeStackCounterProps {
  type: SageTypesType;
  stack: number;
}

export const SageTypeStackCounter = ({ type, stack: _stack }: SageTypeStackCounterProps) => {
  if (!type) return <div></div>;
  const stack = getStackForDisplaying(type, _stack);
  const maxStack = SageTypes[type].fullStack;

  const [ActiveStackIcon, InactiveStackIcon] = type === SageTypesTypes.CHAOS ? [ActiveChaosStackIcon, InactiveChaosStackIcon] : [ActiveOrderStackIcon, InactiveOrderStackIcon];

  return (
    <S.SageTypeStackCounter>
      {Array.from({ length: stack }).map((_) => (
        <ActiveStackIcon />
      ))}
      {Array.from({ length: maxStack - stack }).map((_) => (
        <InactiveStackIcon />
      ))}
    </S.SageTypeStackCounter>
  );
};
