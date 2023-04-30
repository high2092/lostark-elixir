/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react';
import * as S from '../style/index.style';
import { ADVICE_COUNT, AUDIO_RESOURCE_URL_LIST, CENTERED_FLEX_STYLE, FIRST_VISIT_HELP_TEXT, DIALOGUE_END_INDEX as I, MAX_ACTIVE, OPTION_COUNT, Placeholders, STACK_COUNTER_EXPECTED_HEIGHT, VISITED_COOKIE_KEY } from '../constants';
import { Activation } from '../components/Activation';
import { getAdviceRerollButtonText, isFullStack, playClickSound } from '../util';
import { SageTypeStackCounter } from '../components/SageTypeStackCounter';
import { Sage } from '../domain/Sage';
import { BGMPlayer } from '../components/BGMPlayer';
import { Loading } from '../components/Loading';
import { useCookies } from 'react-cookie';
import { AlchemyStatuses } from '../type/common';
import { useAppDispatch, useAppSelector } from '../store';
import { alchemy, clearStatusText, drawAdvices, drawOptions, pickAdvice, pickOption } from '../features/elixirSlice';

const ButtonTexts = {
  [AlchemyStatuses.REFINE]: '효과 정제',
  [AlchemyStatuses.ADVICE]: '조언 선택',
  [AlchemyStatuses.ALCHEMY]: '연성하기',
};

const MaterialSectionText = {
  SELECT_OPTION: '엘릭서에 정제할 효과를 위 항목에서 선택하세요.',
};

interface AdviceDialogueProps {
  sage: Sage;
}

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

const Gold = ({ amount }: { amount: number }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{amount}</span>
      <img src="image/gold.png" style={{ width: '16px', height: '16px' }} />
    </div>
  );
};

const Home = () => {
  const [cookies, setCookie] = useCookies();

  const dispatch = useAppDispatch();
  const { sages, adviceRerollChance, alchemyChance, alchemyStatus, elixirs, pickOptionChance } = useAppSelector((state) => state.elixir);

  const [loaded, setLoaded] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [selectedAdviceIndex, setSelectedAdviceIndex] = useState<number>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(null);
  const statusTextTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleWindowClick = () => setIsFirstVisit(false);

    if (!cookies[VISITED_COOKIE_KEY]) {
      setIsFirstVisit(true);
      setCookie(VISITED_COOKIE_KEY, true, { expires: new Date('2030-09-02') });
    }

    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  useEffect(() => {
    const promises: Promise<void>[] = [];
    promises.concat(
      AUDIO_RESOURCE_URL_LIST.map(
        (url) =>
          new Promise((resolve) => {
            const audio = new Audio(url);
            audio.onload = () => resolve();
          })
      )
    );
    promises.concat(
      AUDIO_RESOURCE_URL_LIST.map(
        (url) =>
          new Promise((resolve) => {
            const image = new Image();
            image.src = url;
            image.onload = () => resolve();
          })
      )
    );

    Promise.all(promises).then(() => setLoaded(true));
  });

  useEffect(() => {
    switch (alchemyStatus) {
      case AlchemyStatuses.ADVICE: {
        dispatch(drawAdvices());
      }
    }
  }, [alchemyStatus]);

  useEffect(() => {
    dispatch(drawOptions());
  }, [pickOptionChance]);

  if (!loaded) return <Loading />;

  const handleRefineButtonClick = () => {
    if (alchemyChance <= 0) return;
    if (selectedAdviceIndex === null && alchemyStatus !== AlchemyStatuses.ALCHEMY) {
      alert('조언을 선택해주세요.');
      return;
    }

    dispatch(clearStatusText());

    switch (alchemyStatus) {
      case AlchemyStatuses.REFINE: {
        const { id } = sages[selectedAdviceIndex].elixir;
        dispatch(pickOption(id));
        break;
      }
      case AlchemyStatuses.ADVICE: {
        try {
          dispatch(pickAdvice({ selectedAdviceIndex, selectedOptionIndex }));
        } catch (e) {
          console.error(e);
          alert('옵션을 선택해주세요.');
          return;
        }
        break;
      }
      case AlchemyStatuses.ALCHEMY: {
        dispatch(alchemy());
        break;
      }
    }

    setStatusTextTimeout();

    setSelectedAdviceIndex(null);
    setSelectedOptionIndex(null);
  };

  const handleElixirOptionClick = (e: React.MouseEvent, idx: number) => {
    if (alchemyStatus === AlchemyStatuses.ALCHEMY || getDisabled()) return;
    if (elixirs[idx].locked) return;
    setSelectedOptionIndex(idx);
    playClickSound();
  };

  const handleRerollButtonClick = () => {
    if (adviceRerollChance <= 0 || alchemyStatus !== AlchemyStatuses.ADVICE) return;
    dispatch(drawAdvices({ reroll: true }));
    playClickSound();
  };

  const handleAdviceClick = (e: React.MouseEvent, idx: number) => {
    if (getAdviceButtonDisabled(sages[idx])) return;
    setSelectedAdviceIndex(idx);
    playClickSound();
  };

  const getDisabled = () => {
    return alchemyChance <= 0;
  };

  const getAdviceButtonDisabled = (sage: Sage) => {
    return alchemyChance <= 0 || alchemyStatus === AlchemyStatuses.ALCHEMY || getDisabled() || sage.meditation;
  };

  const STATUS_TEXT_DISPLAY_TIME_MS = 2000;
  const setStatusTextTimeout = () => {
    clearTimeout(statusTextTimeoutRef.current);
    statusTextTimeoutRef.current = setTimeout(() => {
      dispatch(clearStatusText());
    }, STATUS_TEXT_DISPLAY_TIME_MS);
  };

  return (
    <S.Home>
      <S.MainSection>
        <S.ElixirOptionSection>
          {elixirs.map((elixir, idx) => {
            const { name, part, level, hitRate, bigHitRate, statusText, locked } = elixir;
            return (
              <S.ElixirOption key={`elixirOption-${idx}`} onClick={(e) => handleElixirOptionClick(e, idx)} selected={selectedOptionIndex === idx} locked={locked}>
                <div css={[CENTERED_FLEX_STYLE, { flex: 2 }]}>{locked ? '봉인' : `${hitRate.toFixed(1)}%`}</div>
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
            );
          })}
          {Array.from({ length: OPTION_COUNT - elixirs.length }).map((_, idx) => (
            <S.ElixirOption key={`elixirOptionEmpty-${idx}`} />
          ))}
        </S.ElixirOptionSection>
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
      <BGMPlayer outline={isFirstVisit} />
      {isFirstVisit && <S.FirstVisitHelpText>{FIRST_VISIT_HELP_TEXT}</S.FirstVisitHelpText>}
    </S.Home>
  );
};

export default Home;
