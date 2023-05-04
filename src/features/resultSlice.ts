import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Option, OptionInstance, OptionResult } from '../type/option';
import { COST_PER_ALCHEMY } from '../constants';
import { extractOptionDefaultProps } from '../util';

interface Elixir {
  options: OptionResult[];
}

interface ResultState {
  usedGold: number;
  usedCatalyst: number;
  elixirs: Elixir[];
}

const initialState: ResultState = {
  usedGold: 0,
  usedCatalyst: 0,
  elixirs: [],
};

export const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    chargeCost(state, action?: PayloadAction<boolean>) {
      const free = action.payload;
      if (free) return;

      state.usedGold += COST_PER_ALCHEMY.GOLD;
      state.usedCatalyst += COST_PER_ALCHEMY.CATALYST;
    },

    completeAlchemy(state, action: PayloadAction<OptionInstance[]>) {
      const options = action.payload;
      const result = options
        .filter((option) => !option.locked)
        .map((option) => ({ ...extractOptionDefaultProps(option), level: option.level }))
        .sort((a, b) => b.level - a.level);
      state.elixirs.push({ options: result });
    },
  },
});

export const { chargeCost, completeAlchemy } = resultSlice.actions;
