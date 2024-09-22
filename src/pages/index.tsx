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
import { AlchemyStatuses, ModalTypes } from '../type/common';
import { useAppDispatch, useAppSelector } from '../store';
import { alchemy, clearStatusText, postprocessAlchemy, initElixir, pickAdvice, pickOption, postprocessAdvice } from '../features/elixirSlice';
import { Gold } from '../components/Gold';
import { AdviceSection } from '../components/AdviceSection';
import { setSelectedAdviceIndex, setSelectedOptionIndex, getNextTutorial, initTutorial } from '../features/uiSlice';
import { NoOptionSelectedError } from '../error/NoOptionSelectedError';
import { chargeCost, completeAlchemy } from '../features/resultSlice';
import { DURATION_MS, MaxLevelEffect } from '../components/MaxLevelEffect';
import { openModal } from '../features/modalSlice';

const Home = () => {
  const [cookies, setCookie] = useCookies();

  const dispatch = useAppDispatch();
  const { sages, alchemyChance, alchemyStatus, options, reset, discountRate, maxLevelByAlchemy, maxLevelByAdvice } = useAppSelector((state) => state.elixir);
  const { selectedAdviceIndex, selectedOptionIndex, tutorialIndex, hideBackgroundImage, downsizeHeight } = useAppSelector((state) => state.ui);
  const { usedGold, usedCatalyst } = useAppSelector((state) => state.result);

  const [loaded, setLoaded] = useState(false);
  const statusTextTimeoutRef = useRef<NodeJS.Timeout>();

  const goldCost = COST_PER_ALCHEMY.GOLD * (1 - 0.01 * discountRate);

  const STATUS_TEXT_DISPLAY_TIME_MS = 2000;
  const setStatusTextTimeout = () => {
    clearTimeout(statusTextTimeoutRef.current);
    statusTextTimeoutRef.current = setTimeout(() => {
      dispatch(clearStatusText());
    }, STATUS_TEXT_DISPLAY_TIME_MS);
  };

  const DURATION_MARGIN_MS = 500;
  useEffect(() => {
    if (maxLevelByAlchemy) {
      setTimeout(() => {
        dispatch(postprocessAlchemy());
      }, DURATION_MS + DURATION_MARGIN_MS);
    }
  }, [maxLevelByAlchemy]);

  useEffect(() => {
    if (maxLevelByAdvice) {
      setTimeout(() => {
        dispatch(postprocessAdvice({ selectedAdviceIndex }));
      }, DURATION_MS + DURATION_MARGIN_MS);
    }
  }, [maxLevelByAdvice]);

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
    if (loaded) dispatch(openModal({ type: ModalTypes.PATCH_NOTE }));
  }, [loaded]);

  useEffect(() => {
    if (alchemyStatus === AlchemyStatuses.COMPLETE) {
      dispatch(completeAlchemy(options));
    }
  }, [alchemyStatus]);

  useEffect(() => {
    if (options.length === 4) {
      dispatch(openModal({ type: ModalTypes.FIX_REFINE }));
    }
    setStatusTextTimeout();
  }, [options]);

  useEffect(() => {
    if (reset) dispatch(initElixir());
  }, [reset]);

  if (!loaded) return <Loading />;

  const handleRefineButtonClick = () => {
    if (getDisabled()) return;
    if (selectedAdviceIndex === null && alchemyStatus !== AlchemyStatuses.ALCHEMY) {
      alert('조언을 선택해주세요.');
      return;
    }

    dispatch(clearStatusText());

    switch (alchemyStatus) {
      case AlchemyStatuses.REFINE: {
        const { id } = sages[selectedAdviceIndex].option;
        dispatch(pickOption(id));
        dispatch(chargeCost({ gold: goldCost }));
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
        dispatch(chargeCost({ gold: goldCost }));
        dispatch(setSelectedAdviceIndex(null));
        break;
      }
    }

    dispatch(setSelectedOptionIndex(null));
  };

  const handleElixirOptionClick = (e: React.MouseEvent, idx: number) => {
    if (alchemyStatus === AlchemyStatuses.ALCHEMY || getDisabled()) return;
    if (options[idx].locked) return;
    dispatch(setSelectedOptionIndex(idx));
    playClickSound();
  };

  const getDisabled = () => {
    return alchemyStatus === AlchemyStatuses.COMPLETE;
  };

  return (
    <S.Home downsizeHeight={downsizeHeight}>
      <S.MainSection hideBackgroundImage={hideBackgroundImage}>
        <S.ElixirOptionSection downsizeHeight={downsizeHeight}>
          {options.map((option, idx) => {
            const { name, part, level, statusText, locked } = option;
            return (
              <S.ElixirOption key={`elixirOption-${idx}`} onClick={(e) => handleElixirOptionClick(e, idx)} selected={selectedOptionIndex === idx} locked={locked} downsizeHeight={downsizeHeight}>
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
            <S.ElixirOption key={`elixirOptionEmpty-${idx}`} downsizeHeight={downsizeHeight} />
          ))}
        </S.ElixirOptionSection>
        <AdviceSection />
      </S.MainSection>
      <S.DescriptionSection>
        <div className="grow w-full flex flex-col justify-center">
          {alchemyStatus === AlchemyStatuses.ADVICE ? (
            <div className="grow flex flex-col justify-center items-center">
              <div>{`위 항목에서 현자의 조언을 선택해주세요`}</div>
              <div>{`(선택 후 결정 완료 시 취소 불가)`}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center grow">
              <div className="flex justify-between w-full md:w-3/5 m-auto">
                <div className="flex flex-col items-center justify-between flex-1 px-4 gap-2">
                  <div className="text-left w-full">필요 재료</div>
                  <div className="grow w-full flex items-center justify-between gap-1">
                    <img className="w-7 h-7 bg-[#0b2447]" src="image/material.png" />
                    <div className="whitespace-nowrap">안정된 연성 촉매</div> <div>{`${INITIAL_MATERIAL.CATALYST - usedCatalyst}/${COST_PER_ALCHEMY.CATALYST}`}</div>
                  </div>
                </div>
                <div className="border-r-[1px] border-black" />
                <div className="flex flex-col justify-between flex-1 px-4 gap-2">
                  <div className="text-left">필요 비용</div>
                  <div>
                    <div className="flex justify-between">
                      <div>정제 비용</div>
                      <Gold amount={goldCost} />
                    </div>
                    <div className="flex justify-between">
                      <div>소지 금액</div>
                      <Gold amount={INITIAL_MATERIAL.GOLD - usedGold} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <div>{`연성 ${alchemyChance}회 가능`}</div>
          <S.RefineButton onClick={handleRefineButtonClick} disabled={getDisabled()}>
            {ButtonTexts[alchemyStatus]}
          </S.RefineButton>
        </div>
      </S.DescriptionSection>
      <LeftTopSection />
      {tutorialIndex < TUTORIALS.length && <S.FirstVisitHelpText>{TutorialTexts[TUTORIALS[tutorialIndex]]}</S.FirstVisitHelpText>}
      {(maxLevelByAlchemy || maxLevelByAdvice) && <MaxLevelEffect />}
    </S.Home>
  );
};

export default Home;
