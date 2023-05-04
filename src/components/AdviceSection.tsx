import * as S from './AdviceSection.style';
import { Placeholders, ADVICE_COUNT } from '../constants';
import { setSelectedAdviceIndex } from '../features/uiSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { AlchemyStatuses } from '../type/common';
import { isFullStack, playClickSound } from '../util';
import { SageTypeStackCounter } from './SageTypeStackCounter';
import { DialogueEndTypes, Sage } from '../type/sage';
import { reroll } from '../features/elixirSlice';

interface AdviceDialogueProps {
  sage: Sage;
}

export const AdviceSection = () => {
  const dispatch = useAppDispatch();
  const { sages, adviceRerollChance, alchemyChance, alchemyStatus } = useAppSelector((state) => state.elixir);
  const { selectedAdviceIndex } = useAppSelector((state) => state.ui);

  const handleRerollButtonClick = () => {
    if (adviceRerollChance <= 0) return;

    switch (alchemyStatus) {
      case AlchemyStatuses.REFINE:
      case AlchemyStatuses.ADVICE:
        break;
      default:
        return;
    }

    dispatch(reroll());
    playClickSound();
  };

  const handleAdviceClick = (e: React.MouseEvent, idx: number) => {
    if (getAdviceButtonDisabled(sages[idx])) return;
    dispatch(setSelectedAdviceIndex(idx));
    playClickSound();
  };

  const getAdviceButtonDisabled = (sage: Sage) => {
    return alchemyChance <= 0 || alchemyStatus === AlchemyStatuses.ALCHEMY || sage.meditation;
  };

  return (
    <S.AdviceSection>
      {Array.from({ length: ADVICE_COUNT }).map((_, idx) => {
        const sage = sages[idx];
        const special = alchemyStatus === AlchemyStatuses.ADVICE && isFullStack(sage) ? sage.type : null;
        return (
          <S.AdviceContainer key={`advice-${idx}`} onClick={(e) => handleAdviceClick(e, idx)}>
            <SageTypeStackCounter sage={sage} />
            <S.Advice disabled={getAdviceButtonDisabled(sage)} special={special} selected={selectedAdviceIndex === idx}>
              <AdviceDialogue sage={sage} />
            </S.Advice>
          </S.AdviceContainer>
        );
      })}
      <S.AdviceContainer onClick={handleRerollButtonClick}>
        <SageTypeStackCounter />
        <S.AdviceRerollButton disabled={adviceRerollChance <= 0}>{getAdviceRerollButtonText(adviceRerollChance)}</S.AdviceRerollButton>
      </S.AdviceContainer>
    </S.AdviceSection>
  );
};

const MEDITATION_TEXT = '(현자는 사색에 빠져 있습니다.)';
const AdviceDialogue = ({ sage }: AdviceDialogueProps) => {
  if (sage.meditation) return <div>{MEDITATION_TEXT}</div>;

  const { option, advice } = sage;

  if (advice) {
    const name = Object.values(DialogueEndTypes).reduce((acc, cur) => {
      return acc.replaceAll(Placeholders[cur], sage.dialogueEnds[cur]);
    }, advice.name);
    return <div>{name}</div>;
  } else if (option) {
    const { name, part, type } = option;
    return (
      <div>
        <div>
          <span>{`${name}${type ? ` (${type})` : ''}`}</span>
          <span>{` 효과를 정제하는건 ${sage.dialogueEnds.어떤가}?`}</span>
        </div>
        <div>{`(${part ? `${part} 전용` : '공용'})`}</div>
      </div>
    );
  }

  return <></>;
};

function getAdviceRerollButtonText(chance: number) {
  return `다른 조언 보기 (${chance}회 남음)`;
}
