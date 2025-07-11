import { configureStore } from '@reduxjs/toolkit'
import articleReducer from './reducers/articleReducer'

export const makeStore = () => {
  return configureStore({
    reducer: {
      article: articleReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
