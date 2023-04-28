import * as S from './SageTypeStackCounter.style';
import { SageTypes } from '../constants';
import { SageInstance, SageTypesType, SageTypesTypes } from '../type/sage';
import { getStackForDisplaying } from '../util';
import { ActiveChaosStackIcon } from './ActiveChaosStackIcon';
import { ActiveOrderStackIcon } from './ActiveOrderStackIcon';
import { InactiveChaosStackIcon } from './InactiveChaosStackIcon';
import { InactiveOrderStackIcon } from './InactiveOrderStackIcon';

interface SageTypeStackCounterProps {
  sage: SageInstance;
}

export const SageTypeStackCounter = ({ sage }: SageTypeStackCounterProps) => {
  const { type, stack } = sage;
  if (!type) return <div></div>;
  const maxStack = SageTypes[type].fullStack;

  const [ActiveStackIcon, InactiveStackIcon] = type === SageTypesTypes.CHAOS ? [ActiveChaosStackIcon, InactiveChaosStackIcon] : [ActiveOrderStackIcon, InactiveOrderStackIcon];

  return (
    <S.SageTypeStackCounter>
      {Array.from({ length: stack }).map((_, idx) => (
        <ActiveStackIcon key={`activeStackIcon-${idx}`} />
      ))}
      {Array.from({ length: maxStack - stack }).map((_, idx) => (
        <InactiveStackIcon key={`inactiveStackIcon-${idx}`} />
      ))}
    </S.SageTypeStackCounter>
  );
};
