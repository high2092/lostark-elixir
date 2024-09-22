import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Option, OptionInstance, OptionResult } from '../type/option';
import { COST_PER_ALCHEMY } from '../constants';
import { extractOptionDefaultProps } from '../util';

export interface Elixir {
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

interface ChargeCostPayload {
  gold: number;
  free?: boolean;
}

export const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    chargeCost(state, action: PayloadAction<ChargeCostPayload>) {
      const { gold, free } = action.payload;
      if (free) return;

      state.usedGold += gold;
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
