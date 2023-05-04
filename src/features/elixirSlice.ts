import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Sage, SageKeys, SageTypesTypes } from '../type/sage';
import { SageTemplates } from '../database/sage';
import { DEFAULT_ADVICE_REROLL_CHANCE, OPTION_COUNT } from '../constants';
import { OptionInstance } from '../type/option';
import { AdviceAfterEffect } from '../type/advice';
import { adviceService } from '../service/AdviceService';
import { alchemyService } from '../service/AlchemyService';
import { ALCHEMY_CHANCE } from '../constants';
import { optionService } from '../service/OptionService';
import { AlchemyStatus, AlchemyStatuses } from '../type/common';
import { createSage, isFullStack } from '../util';

interface ElixirState {
  sages: Sage[];
  options: OptionInstance[];
  adviceRerollChance: number;
  pickOptionChance: number;
  alchemyChance: number;
  adviceAfterEffect: AdviceAfterEffect;
  alchemyStatus: AlchemyStatus;
  reset: boolean;
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
        const advices = adviceService.getAdvices(state.sages, state.options, state.alchemyChance);
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
          const advices = adviceService.getAdvices(state.sages, state.options, state.alchemyChance);
          state.sages.forEach((sage, i) => (sage.advice = advices[i]));
          break;
        }
      }
      state.adviceRerollChance--;
    },

    pickAdvice(state, action: PayloadAction<{ selectedAdviceIndex: number; selectedOptionIndex: number }>) {
      const { selectedAdviceIndex, selectedOptionIndex } = action.payload;
      const { advice } = state.sages[selectedAdviceIndex];
      const { options, extraTarget, extraAlchemy, extraChanceConsume, saveChance, enterMeditation, addRerollChance } = adviceService.executeAdvice(advice, state.options, selectedOptionIndex);
      state.options = options;
      state.adviceAfterEffect = { extraTarget, extraAlchemy, extraChanceConsume, saveChance };

      if (addRerollChance) state.adviceRerollChance += addRerollChance;
      if (enterMeditation) state.sages[selectedAdviceIndex].meditation = true;

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

      state.alchemyStatus = AlchemyStatuses.ALCHEMY;
    },

    alchemy(state) {
      const { options, adviceAfterEffect } = state;
      state.options = alchemyService.alchemy(options, adviceAfterEffect);

      for (const sage of state.sages) {
        const { type, stack } = sage;
        sage.viewStack = { type, stack };
      }

      const { extraChanceConsume, saveChance } = adviceAfterEffect;
      state.adviceAfterEffect = {};

      const advices = adviceService.getAdvices(state.sages, state.options, state.alchemyChance);
      state.sages.forEach((sage, i) => (sage.advice = advices[i]));

      if (!saveChance) state.alchemyChance -= 1 + (extraChanceConsume ?? 0);
      state.alchemyStatus = state.alchemyChance ? AlchemyStatuses.ADVICE : AlchemyStatuses.COMPLETE;
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
      state.reset = true;
    },

    initElixir(state) {
      const options = optionService.drawOptions();
      state.sages.forEach((sage, i) => (sage.option = options[i]));
      state.reset = false;
    },
  },
});

export const { pickOption, reroll, pickAdvice, alchemy, clearStatusText, resetElixir, initElixir } = elixirSlice.actions;
