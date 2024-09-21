import { COST_PER_ALCHEMY } from '../../../constants';
import { pickOption } from '../../../features/elixirSlice';
import { closeModal } from '../../../features/modalSlice';
import { chargeCost } from '../../../features/resultSlice';
import { setSelectedAdviceIndex } from '../../../features/uiSlice';
import { optionService } from '../../../service/OptionService';
import { twClsx } from '../../../shared/utils/tw';
import { useAppDispatch, useAppSelector } from '../../../store';
import { PreparedModalProps } from '../../../type/common';
import { CenteredModal } from '../../Modal';

export function FixRefineModal({ zIndex }: PreparedModalProps) {
  return <CenteredModal content={<FixRefineModalContent />} zIndex={zIndex} dimmedOpacity={0} handleDimmedClick={() => {}} />;
}

function FixRefineModalContent() {
  const { options } = useAppSelector((state) => state.elixir);
  const dispatch = useAppDispatch();

  const handleClick = (optionId: number) => {
    dispatch(pickOption(optionId));
    dispatch(chargeCost({ gold: COST_PER_ALCHEMY.GOLD }));
    dispatch(setSelectedAdviceIndex(null));
    dispatch(closeModal());
  };

  return (
    <div className="rounded-[16px] bg-black/70 p-2 flex flex-col items-center gap-2">
      <div className="text-yellow-500">다음 원하는 정제 효과를 선택하세요</div>
      <div className=" grid grid-cols-3 gap-1 h-[80vw] overflow-y-auto w-max">
        {optionService.options.map(({ id, name, part }) => {
          const disabled = !!options.find((selected) => selected.id === id || (part && selected.part === part)); // @TODO: ID로 찾기
          return (
            <button key={name} className={twClsx('py-2 px-2 bg-slate-900 rounded-sm text-center whitespace-nowrap text-sm', disabled && 'brightness-50')} disabled={disabled} onClick={() => handleClick(id)}>
              <div className="text-yellow-500">{name}</div>
              <div className="text-white text-xs">{`(${part ? `${part} 전용` : '공용'})`}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
