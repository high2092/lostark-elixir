/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react';
import * as S from '../style/index.style';
import {
  AUDIO_RESOURCE_URL_LIST,
  ButtonTexts,
  CENTERED_FLEX_STYLE,
  MAX_ACTIVE,
  REFINE_DESCRIPTION_TEXT,
  OPTION_COUNT,
  STACK_COUNTER_EXPECTED_HEIGHT,
  TUTORIALS,
  TutorialStatus,
  VISITED_COOKIE_KEY,
  TutorialTexts,
  IMAGE_RESOURCE_URL_LIST,
  MOBILE_CRITERIA_MAX_WIDTH,
  COST_PER_ALCHEMY,
  INITIAL_MATERIAL,
} from '../constants';
import { Activation } from '../components/Activation';
import { getBigHitRate, getHitRate, getOptionName, playClickSound } from '../util';
import { LeftTopSection } from '../components/LeftTopSection';
import { Loading } from '../components/Loading';
import { useCookies } from 'react-cookie';
import { AlchemyStatuses } from '../type/common';
import { useAppDispatch, useAppSelector } from '../store';
import { alchemy, clearStatusText, drawAdvices, initElixir, pickAdvice, pickOption } from '../features/elixirSlice';
import { Gold } from '../components/Gold';
import { AdviceSection } from '../components/AdviceSection';
import { setSelectedAdviceIndex, setSelectedOptionIndex, getNextTutorial, initTutorial } from '../features/uiSlice';
import { NoOptionSelectedError } from '../error/NoOptionSelectedError';
import { chargeCost, completeAlchemy } from '../features/resultSlice';

const Home = () => {
  const [cookies, setCookie] = useCookies();

  const dispatch = useAppDispatch();
  const { sages, alchemyChance, alchemyStatus, options, reset } = useAppSelector((state) => state.elixir);
  const { selectedAdviceIndex, selectedOptionIndex, tutorialIndex } = useAppSelector((state) => state.ui);
  const { usedGold, usedCatalyst } = useAppSelector((state) => state.result);

  const [loaded, setLoaded] = useState(false);
  const statusTextTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleWindowClick = () => dispatch(getNextTutorial());

    // if (!cookies[VISITED_COOKIE_KEY]) {
    dispatch(initTutorial());
    //   setCookie(VISITED_COOKIE_KEY, true, { expires: new Date('2030-09-02') });
    // }

    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  useEffect(() => {
    const promises: Promise<void>[] = [
      ...IMAGE_RESOURCE_URL_LIST.map(
        (url) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = () => resolve();
            image.src = url;
          })
      ),
    ];

    AUDIO_RESOURCE_URL_LIST.forEach((url) => {
      const audio = new Audio();
      audio.src = url;
    });

    Promise.all(promises).then(() => setLoaded(true));
  }, []);

  useEffect(() => {
    switch (alchemyStatus) {
      case AlchemyStatuses.ADVICE: {
        dispatch(drawAdvices());
        break;
      }
      case AlchemyStatuses.COMPLETE: {
        dispatch(completeAlchemy(options));
        break;
      }
    }
  }, [alchemyStatus]);

  useEffect(() => {
    if (reset) dispatch(initElixir());
  }, [reset]);

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
        const { id } = sages[selectedAdviceIndex].option;
        dispatch(pickOption(id));
        dispatch(chargeCost());
        dispatch(setSelectedAdviceIndex(null));
        break;
      }
      case AlchemyStatuses.ADVICE: {
        try {
          dispatch(pickAdvice({ selectedAdviceIndex, selectedOptionIndex }));
        } catch (e) {
          if (e instanceof NoOptionSelectedError) {
            alert('옵션을 선택해주세요.');
          } else {
            throw e;
          }

          return;
        }
        break;
      }
      case AlchemyStatuses.ALCHEMY: {
        dispatch(alchemy());
        dispatch(chargeCost());
        dispatch(setSelectedAdviceIndex(null));
        break;
      }
    }

    setStatusTextTimeout();
    dispatch(setSelectedOptionIndex(null));
  };

  const handleElixirOptionClick = (e: React.MouseEvent, idx: number) => {
    if (alchemyStatus === AlchemyStatuses.ALCHEMY || getDisabled()) return;
    if (options[idx].locked) return;
    dispatch(setSelectedOptionIndex(idx));
    playClickSound();
  };

  const getDisabled = () => {
    return alchemyChance <= 0;
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
          {options.map((option, idx) => {
            const { name, part, level, statusText, locked } = option;
            return (
              <S.ElixirOption key={`elixirOption-${idx}`} onClick={(e) => handleElixirOptionClick(e, idx)} selected={selectedOptionIndex === idx} locked={locked}>
                <div css={[CENTERED_FLEX_STYLE, { flex: 2 }]}>{locked ? '봉인' : `${getHitRate(option).toFixed(1)}%`}</div>
                <div css={{ flex: 7, paddingRight: '1rem', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{getOptionName(option)}</span>
                    <span>{`(${part ? `${part} 전용` : '공용'})`}</span>
                  </div>
                  <Activation percentage={level / MAX_ACTIVE} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{statusText}</div>
                    <div>{`${getBigHitRate(option)}%`}</div>
                  </div>
                </div>
              </S.ElixirOption>
            );
          })}
          {Array.from({ length: OPTION_COUNT - options.length }).map((_, idx) => (
            <S.ElixirOption key={`elixirOptionEmpty-${idx}`} />
          ))}
        </S.ElixirOptionSection>
        <AdviceSection />
      </S.MainSection>
      <S.DescriptionSection>
        <S.DescriptionSSection>
          {alchemyStatus === AlchemyStatuses.ADVICE ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div>{`위 항목에서 현자의 조언을 선택해주세요`}</div>
              <div>{`(선택 후 결정 완료 시 취소 불가)`}</div>
            </div>
          ) : (
            <>
              <S.MaterialSectionText>{alchemyStatus === AlchemyStatuses.REFINE ? REFINE_DESCRIPTION_TEXT : ''}</S.MaterialSectionText>
              <S.MaterialInfo>
                <S.MaterialInfoSubSection>
                  <div style={{ flex: 1, textAlign: 'left' }}>필요 재료</div>
                  <div style={{ flex: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img style={{ width: '30px', height: '30px', background: '#0b2447' }} src="image/material.png" />
                      <div>안정된 연성 촉매</div>
                    </div>
                    <div>{`${INITIAL_MATERIAL.CATALYST - usedCatalyst}/${COST_PER_ALCHEMY.CATALYST}`}</div>
                  </div>
                </S.MaterialInfoSubSection>
                <S.VerticalRule height="4rem" />
                <S.MaterialInfoSubSection>
                  <div style={{ flex: 1, textAlign: 'left' }}>필요 비용</div>
                  <div style={{ flex: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                      <div>정제 비용</div>
                      <Gold amount={COST_PER_ALCHEMY.GOLD} />
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                      <div>소지 금액</div>
                      <Gold amount={INITIAL_MATERIAL.GOLD - usedGold} />
                    </div>
                  </div>
                </S.MaterialInfoSubSection>
              </S.MaterialInfo>
            </>
          )}
        </S.DescriptionSSection>

        <div>{`연성 ${alchemyChance}회 가능`}</div>
        <S.RefineButton onClick={handleRefineButtonClick} disabled={getDisabled()}>
          {ButtonTexts[alchemyStatus]}
        </S.RefineButton>
      </S.DescriptionSection>
      <LeftTopSection />
      {tutorialIndex < TUTORIALS.length && <S.FirstVisitHelpText>{TutorialTexts[TUTORIALS[tutorialIndex]]}</S.FirstVisitHelpText>}
    </S.Home>
  );
};

export default Home;
