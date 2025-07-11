import { configureStore } from '@reduxjs/toolkit'
import postingReducer from './reducers/postingReducer'

export const makeStore = () => {
  return configureStore({
    reducer: {
      posting: postingReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
