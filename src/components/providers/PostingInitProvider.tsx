'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook'
import { setArticles, setPages, setPrompts } from '@/lib/reducers/postingReducer'
import { postingInitApi } from '@/requests'
import { createContext, ReactNode, useCallback, useContext, useEffect } from 'react'

interface PostingInitContextValue {}

const InitContext = createContext<PostingInitContextValue | undefined>(undefined)

function PostingInitProvider({ children }: { children: ReactNode }) {
  // hooks
  const dispatch = useAppDispatch()

  // store
  const refreshPoint = useAppSelector(state => state.posting.refreshPoint)

  // fetch prompts, pages, articles
  const init = useCallback(async () => {
    try {
      const { pages, prompts, articles } = await postingInitApi()

      dispatch(setPages(pages))
      dispatch(setPrompts(prompts))
      dispatch(setArticles(articles))
    } catch (err: any) {
      console.log(err)
    }
  }, [dispatch])

  // initially get wallets
  useEffect(() => {
    init()
  }, [init, refreshPoint])

  const value: PostingInitContextValue = {}

  return <InitContext.Provider value={value}>{children}</InitContext.Provider>
}

export default PostingInitProvider

export const useInit = (): PostingInitContextValue => {
  const context = useContext(InitContext)
  if (!context) {
    throw new Error('useInit must be used within an InitProvider')
  }
  return context
}
