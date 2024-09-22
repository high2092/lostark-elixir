import { useReducer, useState } from 'react';
import { useAppSelector } from '../../../store';
import { CenteredModal } from '../../Modal';
import { PreparedModalProps } from '../../../type/common';
import { getActivationByLevel, getOptionName } from '../../../util';
import { ElixirIcon } from '../../ElixirIcon';
import { twClsx } from '../../../shared/utils/tw';
import { Elixir } from '../../../features/resultSlice';
import * as Popover from '@radix-ui/react-popover';
import { PopoverContent } from './popover/ui';
import { SwitchIcon } from '../../SwitchIcon';
import { IconButton } from '../../common/IconButton';

export function InventoryModal({ zIndex }: PreparedModalProps) {
  return <CenteredModal content={<InventoryModalContent />} zIndex={zIndex} />;
}

function InventoryModalContent() {
  const { usedGold, usedCatalyst, elixirs } = useAppSelector((state) => state.result);
  const { resetCount } = useAppSelector((state) => state.ui);
  const [ui, toggleUi] = useReducer((ui: 'grid' | 'list') => {
    return ui === 'list' ? 'grid' : 'list';
  }, 'grid');

  return (
    <div className="p-8 bg-white rounded-2xl w-max">
      <div className="overflow-y-scroll scrollbar-hide h-[30vh] w-[80vw]">
        <div className={twClsx('flex flex-wrap gap-4', ui === 'list' && 'flex-col gap-2')}>{elixirs.map(({ options }, i) => (ui === 'list' ? <ListViewElixir key={i} options={options} /> : <GridViewElixir options={options} />))}</div>
      </div>
      <div className="flex justify-between items-center -mb-4 mt-4">
        <div className="text-[0.5rem]">
          <div>사용한 엘릭서: {1 + resetCount}</div>
          <div>사용한 골드: {usedGold.toLocaleString()}</div>
          <div>사용한 연성 촉매: {usedCatalyst.toLocaleString()}</div>
        </div>
        <IconButton onClick={toggleUi}>
          <SwitchIcon />
        </IconButton>
      </div>
    </div>
  );
}

function ListViewElixir({ options }: Elixir) {
  const [option1, option2] = options;
  return (
    <div className="flex px-4 py-2 border border-[#bbbbbb] rounded-md gap-4 w-full">
      <div className="flex-1 flex justify-between items-center gap-6 break-keep">
        <div>{getOptionName(option1)}</div>
        <div>{getActivationByLevel(option1.level)}</div>
      </div>
      <div className="border-r-[1px]" />
      <div className="flex-1 flex justify-between items-center gap-6 break-keep">
        <div>{getOptionName(option2)}</div>
        <div>{getActivationByLevel(option2.level)}</div>
      </div>
    </div>
  );
}

function GridViewElixir({ options }: Elixir) {
  const [hovered, setHovered] = useState(false);
  return (
    <Popover.Root open={hovered}>
      <Popover.Trigger onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)} className={twClsx('p-1 flex justify-center', hovered && 'fill-[#c9a7eb]')}>
        <ElixirIcon />
      </Popover.Trigger>
      <Popover.Portal>
        <PopoverContent>
          {options.map((option, i) => (
            <div key={i} className="flex justify-between gap-2">
              <span>{getOptionName(option)}</span>
              <span>{getActivationByLevel(option.level)}</span>
            </div>
          ))}
        </PopoverContent>
      </Popover.Portal>
    </Popover.Root>
  );
}
