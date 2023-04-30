import * as S from './AdviceSection.style';
import { Placeholders, DIALOGUE_END_INDEX as I, ADVICE_COUNT, STACK_COUNTER_EXPECTED_HEIGHT } from '../constants';
import { drawAdvices } from '../features/elixirSlice';
import { setSelectedAdviceIndex } from '../features/uiSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { AlchemyStatuses } from '../type/common';
import { isFullStack, playClickSound } from '../util';
import { SageTypeStackCounter } from './SageTypeStackCounter';
import { Sage } from '../type/sage';

interface AdviceDialogueProps {
  sage: Sage;
}

export const AdviceSection = () => {
  const dispatch = useAppDispatch();
  const { sages, adviceRerollChance, alchemyChance, alchemyStatus } = useAppSelector((state) => state.elixir);
  const { selectedAdviceIndex } = useAppSelector((state) => state.ui);

  const handleRerollButtonClick = () => {
    if (adviceRerollChance <= 0 || alchemyStatus !== AlchemyStatuses.ADVICE) return;
    dispatch(drawAdvices({ reroll: true }));
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
          <S.Advice key={`advice-${idx}`} onClick={(e) => handleAdviceClick(e, idx)}>
            <div style={{ height: STACK_COUNTER_EXPECTED_HEIGHT }}>
              <SageTypeStackCounter sage={sage} />
            </div>
            <S.AdviceDialogue disabled={getAdviceButtonDisabled(sage)} special={special} selected={selectedAdviceIndex === idx}>
              <AdviceDialogue sage={sage} />
            </S.AdviceDialogue>
          </S.Advice>
        );
      })}
      <S.AdviceRerollButton onClick={handleRerollButtonClick} disabled={adviceRerollChance <= 0}>
        {getAdviceRerollButtonText(adviceRerollChance)}
      </S.AdviceRerollButton>
    </S.AdviceSection>
  );
};

const MEDITATION_TEXT = '(현자는 사색에 빠져 있습니다.)';
const AdviceDialogue = ({ sage }: AdviceDialogueProps) => {
  if (sage.meditation) return <div>{MEDITATION_TEXT}</div>;

  const { elixir, advice } = sage;

  if (advice) {
    const name = Object.values(I).reduce((acc, cur) => {
      return acc.replace(Placeholders[cur], sage.dialogueEnds[cur]);
    }, advice.name);
    return <div>{name}</div>;
  } else if (elixir) {
    const { name, part, type } = elixir;
    return (
      <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span>{`${name}${type ? ` (${type})` : ''}`}</span>
          <span>{` 효과를 정제하는건 ${sage.dialogueEnds[I.어떤가]}?`}</span>
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
