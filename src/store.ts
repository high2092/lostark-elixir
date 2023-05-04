import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { elixirSlice } from './features/elixirSlice';
import { uiSlice } from './features/uiSlice';
import { resultSlice } from './features/resultSlice';
import { modalSlice } from './features/modalSlice';

export const store = configureStore({
  reducer: {
    elixir: elixirSlice.reducer,
    ui: uiSlice.reducer,
    result: resultSlice.reducer,
    modal: modalSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
