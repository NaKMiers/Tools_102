import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const article = createSlice({
  name: 'article',
  initialState: {
    articles: [] as any[],
    loading: false as boolean,
  },
  reducers: {
    setArticles: (state, action: PayloadAction<any>) => {
      state.articles = action.payload
    },
    addArticle: (state, action: PayloadAction<any>) => {
      state.articles = [action.payload, ...state.articles]
    },
    updateArticle: (state, action: PayloadAction<any>) => {
      state.articles = state.articles.map(budget =>
        budget._id === action.payload._id ? action.payload : budget
      )
    },
    deleteArticle: (state, action: PayloadAction<any>) => {
      state.articles = state.articles.filter(budget => budget._id !== action.payload._id)
    },
    setLoading: (state, action: PayloadAction<any>) => {
      state.loading = action.payload
    },
  },
})

export const { setArticles, addArticle, updateArticle, deleteArticle, setLoading } = article.actions
export default article.reducer
