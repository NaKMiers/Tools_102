'use client'

import ArticleCard from '@/components/ArticleCard'
import CreatePageDrawer from '@/components/drawers/CreatePageDrawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Article, Page } from '@/lib/db'
import { getPagesApi, getSavedArticlesApi } from '@/requests'
import { LucidePlus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

function SavedPage() {
  const [search, setSearch] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [pages, setPages] = useState<Page[]>([])

  const fetchSavedArticles = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      const query = params.toString()

      const { articles } = await getSavedArticlesApi(query)

      setArticles(articles)
    } catch (err: any) {
      toast.error(err.message)
      setArticles([])
    }
  }, [search])

  // fetch pages
  const fetchPages = useCallback(async () => {
    try {
      const { pages } = await getPagesApi()
      setPages(pages)
    } catch (err: any) {
      toast.error(err.message)
    }
  }, [])

  const reset = useCallback(() => {
    setSearch('')
    setArticles([])
  }, [])

  useEffect(() => {
    fetchSavedArticles()
    fetchPages()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        fetchSavedArticles()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fetchSavedArticles])

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-primary text-center text-3xl font-bold">Saved Articles</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          placeholder="Search content..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="col-span-full flex justify-end gap-2">
          <Button onClick={fetchSavedArticles}>Search</Button>
          <Button onClick={reset}>Reset</Button>
        </div>
      </div>

      {/* Page Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <ArticleCard
            article={article}
            options={pages}
            refresh={fetchSavedArticles}
            saved
            key={article._id}
          />
        ))}
      </div>

      <CreatePageDrawer
        refresh={fetchSavedArticles}
        trigger={
          <Button
            variant="default"
            className="fixed right-2 bottom-[calc(78px)] z-20 h-10 rounded-full xl:right-[calc(50%-640px+21px)]"
          >
            <LucidePlus size={24} />
            Create Page
          </Button>
        }
      />
    </div>
  )
}

export default SavedPage
