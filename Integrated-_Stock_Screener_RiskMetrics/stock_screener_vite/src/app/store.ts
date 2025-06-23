import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/counterSlice';
import basketReducer from '@/features/basket/basketSlice'
import portfolioReducer from '@/features/portfolio/portfolioSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    basket: basketReducer,
    portfolio: portfolioReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
