import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Article, Page, Prompt } from '../db'

export const posting = createSlice({
  name: 'posting',
  initialState: {
    pages: [] as Page[],
    articles: [] as Article[],
    prompts: [] as Prompt[],
    refreshPoint: new Date().getTime(),

    loading: false as boolean,
  },
  reducers: {
    setPages: (state, action: PayloadAction<Page[]>) => {
      state.pages = action.payload
    },
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload
    },
    setPrompts: (state, action: PayloadAction<Prompt[]>) => {
      state.prompts = action.payload
    },

    refresh: state => {
      state.refreshPoint = new Date().getTime()
    },

    setLoading: (state, action: PayloadAction<any>) => {
      state.loading = action.payload
    },
  },
})

export const { setArticles, setPages, setPrompts, setLoading, refresh } = posting.actions
export default posting.reducer
