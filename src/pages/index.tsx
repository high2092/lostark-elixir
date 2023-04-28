/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react';
import * as S from '../style/index.style';
import { cpu } from '../CPU';
import { ADVICE_COUNT, ALCHEMY_CHANCE, CENTERED_FLEX_STYLE, MAX_ACTIVE } from '../constants';
import { adviceService } from '../AdviceService';
import { alchemyService } from '../AlchemyService';
import { Activation } from '../components/Activation';
import { ADVICE_DIALOGUE_END1_PLACEHOLDER } from '../database/advice';
import { getStackForDisplaying } from '../util';

const AlchemyStatus = {
  REFINE: 'refine', // 정제
  ADVICE: 'advice', // 조언
  ALCHEMY: 'alchemy', // 연성
} as const;

type AlchemyStatus = (typeof AlchemyStatus)[keyof typeof AlchemyStatus];

const ButtonTexts = {
  [AlchemyStatus.REFINE]: '효과 정제',
  [AlchemyStatus.ADVICE]: '조언 선택',
  [AlchemyStatus.ALCHEMY]: '연성하기',
};

const getAdviceRerollButtonText = (chance: number) => `다른 조언 보기 (${chance}회 남음)`;

const MaterialSectionText = {
  SELECT_OPTION: '엘릭서에 정제할 효과를 위 항목에서 선택하세요.',
};

const initialSages: SageInstance[] = [
  { name: '루베도', SELECT_OPTION_DIALOGUE_END: '어때?', ADVICE_DIALOGUE_END1: '주지', stack: 0, advice: null },
  { name: '비르디타스', SELECT_OPTION_DIALOGUE_END: '어떤가?', ADVICE_DIALOGUE_END1: '주겠네', stack: 0, advice: null },
  { name: '치트리니', SELECT_OPTION_DIALOGUE_END: '어때요?', ADVICE_DIALOGUE_END1: '드리죠', stack: 0, advice: null },
];

interface ElixirOptionDialogueProps {
  SelectOption: ElixirInstance;
  sage: Sage;
}
const SelectOptionDialogue = ({ SelectOption: elixirOption, sage }: ElixirOptionDialogueProps) => {
  if (!elixirOption) return <></>;

  const { name, type, part } = elixirOption;
  return (
    <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <span>{`${name}${type ? ` (${type})` : ''}`}</span>
        <span>{` 효과를 정제하는건 ${sage.SELECT_OPTION_DIALOGUE_END}`}</span>
      </div>
      <div>{`(${part ? `${part} 전용` : '공용'})`}</div>
    </div>
  );
};

interface AdviceDialogueProps {
  sage: SageInstance;
}

const AdviceDialogue = ({ sage }: AdviceDialogueProps) => {
  const { advice } = sage;
  if (!advice) return <></>;

  return <div>{advice.name.replace(ADVICE_DIALOGUE_END1_PLACEHOLDER, sage.ADVICE_DIALOGUE_END1)}</div>;
};

const Gold = ({ amount }: { amount: number }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{amount}</span>
      <img src="image/gold.png" style={{ width: '16px', height: '16px' }} />
    </div>
  );
};

const OPTION_COUNT = 5;

const Home = () => {
  const [selectedAdviceIndex, setSelectedAdviceIndex] = useState<number>(null);
  const handleAdviceClick = (e: React.MouseEvent, idx: number) => {
    if (alchemyStatus === AlchemyStatus.ALCHEMY || getDisabled()) return;
    setSelectedAdviceIndex(idx);
    new Audio('sound/click.mp3').play();
  };
  const [elixirOptions, setElixirOptions] = useState<ElixirInstance[]>([]);
  const [selectOptionChance, setSelectOptionChance] = useState(OPTION_COUNT);
  const [selectedOptions, setSelectedOptions] = useState<ElixirInstance[]>([]);
  const [alchemyChance, setAlchemyChance] = useState(ALCHEMY_CHANCE);
  const [adviceOptions, setAdviceOptions] = useState<IAdviceInstance[]>([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(null);
  const [alchemyStatus, setAlchemyStatus] = useState<AlchemyStatus>();
  const statusTextTimeoutRef = useRef<NodeJS.Timeout>();
  const [turn, setTurn] = useState(0);
  const [sages, setSages] = useState<SageInstance[]>(initialSages);

  useEffect(() => {
    switch (alchemyStatus) {
      case AlchemyStatus.REFINE: {
        setElixirOptions(cpu.drawOptions());
        break;
      }
      case AlchemyStatus.ADVICE: {
        setSages(adviceService.drawAdvices(selectedOptions, sages, turn));
        break;
      }
    }
  }, [alchemyStatus]);

  useEffect(() => {
    cpu.init();
    setAlchemyStatus(AlchemyStatus.REFINE);
  }, []);

  useEffect(() => {
    if (selectOptionChance === OPTION_COUNT) return;
    setElixirOptions(cpu.drawOptions());
    if (selectOptionChance === 0) setAlchemyStatus(AlchemyStatus.ADVICE);
  }, [selectOptionChance]);

  const handleRefineButtonClick = () => {
    if (alchemyChance <= 0) return;
    if (selectedAdviceIndex === null && alchemyStatus !== AlchemyStatus.ALCHEMY) {
      alert('조언을 선택해주세요.');
      return;
    }

    switch (alchemyStatus) {
      case AlchemyStatus.REFINE: {
        const id = elixirOptions[selectedAdviceIndex].id;
        const option = cpu.pickOption(id);
        setSelectedOptions((selectedOptions) => selectedOptions.concat(option));
        setSelectOptionChance(selectOptionChance - 1);
        break;
      }
      case AlchemyStatus.ADVICE: {
        const response = adviceService.pickAdvice(selectedAdviceIndex, selectedOptions, sages, selectedOptionIndex);

        if (!response.ok) {
          alert(response.statusText);
          return;
        }

        const { elixirs, sages: _sages } = response.data;
        setSelectedOptions(elixirs);
        setSages(_sages);
        setAlchemyStatus(AlchemyStatus.ALCHEMY);
        break;
      }
      case AlchemyStatus.ALCHEMY: {
        setSelectedOptions(alchemyService.alchemy(selectedOptions));
        setAlchemyChance(alchemyChance - 1);
        setTurn(turn + 1);
        setAlchemyStatus(AlchemyStatus.ADVICE);
        break;
      }
    }

    setSelectedAdviceIndex(null);
    setSelectedOptionIndex(null);
    setStatusTextTimeout();
  };

  const handleElixirOptionClick = (e: React.MouseEvent, idx: number) => {
    if (alchemyStatus === AlchemyStatus.ALCHEMY || getDisabled()) return;
    setSelectedOptionIndex(idx);
    new Audio('sound/click.mp3').play();
  };

  const getDisabled = () => {
    return alchemyChance <= 0;
  };

  const STATUS_TEXT_DISPLAY_TIME_MS = 2000;
  const setStatusTextTimeout = () => {
    clearTimeout(statusTextTimeoutRef.current);
    statusTextTimeoutRef.current = setTimeout(() => {
      setSelectedOptions((selectedOptions) => selectedOptions.map((option) => ({ ...option, statusText: null })));
    }, STATUS_TEXT_DISPLAY_TIME_MS);
  };

  return (
    <S.Home>
      <S.MainSection>
        <S.ElixirOptionSection>
          {selectedOptions.map(({ name, part, level, hitRate, bigHitRate, statusText }, idx) => (
            <S.ElixirOption onClick={(e) => handleElixirOptionClick(e, idx)} selected={selectedOptionIndex === idx}>
              <div css={[CENTERED_FLEX_STYLE, { flex: 2 }]}>{`${hitRate}%`}</div>
              <div css={{ flex: 7, paddingRight: '1rem', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{name}</span>
                  <span>{`(${part ? `${part} 전용` : '공용'})`}</span>
                </div>
                <Activation percentage={level / MAX_ACTIVE} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>{statusText}</div>
                  <div>{`${bigHitRate}%`}</div>
                </div>
              </div>
            </S.ElixirOption>
          ))}
          {Array.from({ length: OPTION_COUNT - selectedOptions.length }).map((_) => (
            <S.ElixirOption />
          ))}
        </S.ElixirOptionSection>
        <S.AdviceSection>
          {Array.from({ length: ADVICE_COUNT }).map((_, idx) => (
            <S.Advice onClick={(e) => handleAdviceClick(e, idx)} selected={selectedAdviceIndex === idx} disabled={alchemyStatus === AlchemyStatus.ALCHEMY || getDisabled()}>
              {sages[idx].type && <div>{`${sages[idx].type} ${getStackForDisplaying(sages[idx].type, sages[idx].stack)}`}</div>}
              {alchemyStatus === AlchemyStatus.REFINE && <SelectOptionDialogue SelectOption={elixirOptions[idx]} sage={sages[idx]} />}
              {alchemyStatus !== AlchemyStatus.REFINE && <AdviceDialogue sage={sages[idx]} />}
            </S.Advice>
          ))}
          <S.AdviceRerollButton>{getAdviceRerollButtonText(2)}</S.AdviceRerollButton>
        </S.AdviceSection>
      </S.MainSection>
      <S.DescriptionSection>
        <S.MaterialSection>
          <S.MaterialSectionText>{MaterialSectionText.SELECT_OPTION}</S.MaterialSectionText>
          <S.MaterialInfo>
            <S.MaterialInfoSubSection>
              <label>필요 재료</label>
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <img style={{ width: '30px', height: '30px', background: '#0b2447' }} src="image/material.png" />
                  </div>
                  <div style={{ flex: 4, padding: '0.5rem' }}>안정된 연성 촉매</div>
                  <div style={{ flex: 4, padding: '0.5rem', textAlign: 'right' }}>413 / 5</div>
                </div>
              </div>
            </S.MaterialInfoSubSection>
            <S.VerticalRule height="3rem" />
            <S.MaterialInfoSubSection>
              <label>필요 비용</label>
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>정제 비용</div>
                  <Gold amount={280} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>소지 금액</div>
                  <Gold amount={26741} />
                </div>
              </div>
            </S.MaterialInfoSubSection>
          </S.MaterialInfo>
        </S.MaterialSection>
        <div>{`연성 ${alchemyChance}회 가능`}</div>
        <S.RefineButton onClick={handleRefineButtonClick} disabled={getDisabled()}>
          {ButtonTexts[alchemyStatus]}
        </S.RefineButton>
      </S.DescriptionSection>
    </S.Home>
  );
};

export default Home;
