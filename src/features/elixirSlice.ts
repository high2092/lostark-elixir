import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Sage, SageKeys, SageTypesTypes } from '../type/sage';
import { SageTemplates } from '../database/sage';
import { DEFAULT_ADVICE_REROLL_CHANCE, OPTION_COUNT } from '../constants';
import { AlchemyResult, OptionInstance } from '../type/option';
import { AdviceAfterEffect, AdviceEffectResult } from '../type/advice';
import { adviceService } from '../service/AdviceService';
import { alchemyService } from '../service/AlchemyService';
import { ALCHEMY_CHANCE } from '../constants';
import { optionService } from '../service/OptionService';
import { AlchemyStatus, AlchemyStatuses } from '../type/common';
import { checkBreakCriticalPoint, checkEarlyComplete, createSage, isFullStack, playRefineFailureSound, playRefineSuccessSound } from '../util';

interface ElixirState {
  sages: Sage[];
  options: OptionInstance[];
  adviceRerollChance: number;
  pickOptionChance: number;
  alchemyChance: number;
  adviceAfterEffect: AdviceAfterEffect;
  alchemyStatus: AlchemyStatus;
  reset: boolean;
  discountRate: number; // [0, 100] 내의 정수
  alchemyResultBuffer: AlchemyResult;
  adviceResultBuffer: AdviceEffectResult;
  maxLevelByAlchemy: boolean;
  maxLevelByAdvice: boolean;
}

const initialSages: Sage[] = [createSage(SageTemplates[SageKeys.L]), createSage(SageTemplates[SageKeys.B]), createSage(SageTemplates[SageKeys.C])];

const initialState: ElixirState = {
  sages: initialSages,
  options: [],
  adviceRerollChance: DEFAULT_ADVICE_REROLL_CHANCE,
  pickOptionChance: OPTION_COUNT,
  alchemyChance: ALCHEMY_CHANCE,
  adviceAfterEffect: {},
  alchemyStatus: AlchemyStatuses.REFINE,
  reset: true,
  discountRate: 0,
  alchemyResultBuffer: null,
  adviceResultBuffer: null,
  maxLevelByAlchemy: false,
  maxLevelByAdvice: false,
};

export const elixirSlice = createSlice({
  name: 'elixir',
  initialState,
  reducers: {
    pickOption(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.options.push(optionService.pickOption(id));
      const options = optionService.drawOptions();
      state.sages.forEach((sage, i) => (sage.option = options[i]));
      if (--state.pickOptionChance === 0) {
        state.alchemyStatus = AlchemyStatuses.ADVICE;
        const advices = adviceService.getAdvices(state.sages, state.options, state.alchemyChance, state.discountRate);
        state.sages.forEach((sage, i) => (sage.advice = advices[i]));
      }
    },

    reroll(state) {
      switch (state.alchemyStatus) {
        case AlchemyStatuses.REFINE: {
          const options = optionService.drawOptions();
          state.sages.forEach((sage, i) => (sage.option = options[i]));
          break;
        }
        case AlchemyStatuses.ADVICE: {
          const advices = adviceService.getAdvices(state.sages, state.options, state.alchemyChance, state.discountRate);
          state.sages.forEach((sage, i) => (sage.advice = advices[i]));
          break;
        }
      }
      state.adviceRerollChance--;
    },

    pickAdvice(state, action: PayloadAction<{ selectedAdviceIndex: number; selectedOptionIndex: number }>) {
      const { selectedAdviceIndex, selectedOptionIndex } = action.payload;
      const { advice } = state.sages[selectedAdviceIndex];

      state.adviceResultBuffer = adviceService.executeAdvice(advice, state.options, selectedOptionIndex);
      if (checkBreakCriticalPoint(state.options, state.adviceResultBuffer.options)) {
        state.maxLevelByAdvice = true;
        return;
      }

      postprocessAdviceInternal(state, action);
    },

    postprocessAdvice(state, action: PayloadAction<{ selectedAdviceIndex: number }>) {
      postprocessAdviceInternal(state, action);
      state.maxLevelByAdvice = false;
    },

    alchemy(state) {
      const { adviceAfterEffect } = state;

      state.alchemyResultBuffer = alchemyService.alchemy(state.options, adviceAfterEffect);
      if (checkBreakCriticalPoint(state.options, state.alchemyResultBuffer.options)) {
        state.maxLevelByAlchemy = true;
        return;
      }

      postprocessAlchemyInternal(state);
    },

    postprocessAlchemy(state) {
      postprocessAlchemyInternal(state);
      state.maxLevelByAlchemy = false;
    },

    clearStatusText(state) {
      state.options.forEach((option) => (option.statusText = null));
    },

    resetElixir(state) {
      optionService.reset();
      adviceService.reset();
      Object.entries(initialState).forEach(([key, value]) => {
        state[key] = value;
      });
    },

    initElixir(state) {
      const options = optionService.drawOptions();
      state.sages.forEach((sage, i) => (sage.option = options[i]));
      state.reset = false;
    },
  },
});

function postprocessAlchemyInternal(state: ElixirState) {
  const { adviceAfterEffect } = state;
  if (state.alchemyResultBuffer.bigHit) playRefineSuccessSound();

  state.options = state.alchemyResultBuffer.options;
  state.alchemyResultBuffer = null;

  for (const sage of state.sages) {
    const { type, stack } = sage;
    sage.viewStack = { type, stack };
  }

  const { extraChanceConsume, saveChance } = adviceAfterEffect;
  state.adviceAfterEffect = {};

  if (!saveChance) state.alchemyChance -= 1 + (extraChanceConsume ?? 0);

  if (state.alchemyChance && !checkEarlyComplete(state.options)) {
    state.alchemyStatus = AlchemyStatuses.ADVICE;
    const advices = adviceService.getAdvices(state.sages, state.options, state.alchemyChance, state.discountRate);
    state.sages.forEach((sage, i) => (sage.advice = advices[i]));
  } else {
    state.alchemyStatus = AlchemyStatuses.COMPLETE;
  }
}

function postprocessAdviceInternal(state: ElixirState, action: PayloadAction<{ selectedAdviceIndex: number }>) {
  const { selectedAdviceIndex } = action.payload;

  const { options, extraTarget, extraAlchemy, extraChanceConsume, saveChance, enterMeditation, addRerollChance, discount } = state.adviceResultBuffer;
  const { advice } = state.sages[selectedAdviceIndex];

  const levelUp = options.reduce((acc, cur, i) => acc || cur.level - state.options[i].level > 0, false);
  if (advice.type !== 'potential' || levelUp) playRefineSuccessSound();
  else playRefineFailureSound();

  state.options = options;
  state.adviceAfterEffect = { extraTarget, extraAlchemy, extraChanceConsume, saveChance };

  if (addRerollChance) state.adviceRerollChance += addRerollChance;
  if (enterMeditation) state.sages[selectedAdviceIndex].meditation = true;
  if (discount) state.discountRate = Math.min(state.discountRate + discount, 100);

  state.sages.forEach((sage, i) => {
    if (isFullStack(sage)) sage.stack = 0;

    if (selectedAdviceIndex === i && sage.type !== SageTypesTypes.ORDER) {
      sage.type = SageTypesTypes.ORDER;
      sage.stack = 0;
    } else if (selectedAdviceIndex !== i && sage.type !== SageTypesTypes.CHAOS) {
      sage.type = SageTypesTypes.CHAOS;
      sage.stack = 0;
    }
    sage.stack++;
  });

  if (checkEarlyComplete(state.options)) {
    state.alchemyStatus = AlchemyStatuses.COMPLETE;
  } else {
    state.alchemyStatus = AlchemyStatuses.ALCHEMY;
  }
}

export const { pickOption, reroll, pickAdvice, alchemy, clearStatusText, resetElixir, initElixir, postprocessAlchemy, postprocessAdvice } = elixirSlice.actions;
