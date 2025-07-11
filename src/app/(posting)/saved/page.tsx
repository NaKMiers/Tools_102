'use client'

import ArticleCard from '@/components/ArticleCard'
import CreatePageDrawer from '@/components/drawers/CreatePageDrawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppSelector } from '@/hooks/reduxHook'
import { LucidePlus } from 'lucide-react'
import { useState } from 'react'

function SavedPage() {
  // store
  const { pages, articles } = useAppSelector(state => state.posting)

  // states
  const [search, setSearch] = useState('')

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-primary text-center text-3xl font-bold">Saved Articles</h1>

      {/* Filters */}
      <Input
        placeholder="Search content..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Page Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles
          .filter(a => {
            const key =
              a.title.toLowerCase().trim() +
              a.desc.toLowerCase().trim() +
              a.content.toLowerCase().trim() +
              (a.author || '').toLowerCase().trim()
            return key.includes(search.toLowerCase().trim())
          })
          .map(article => (
            <ArticleCard
              article={article}
              options={pages}
              saved
              key={article._id}
            />
          ))}
      </div>

      <CreatePageDrawer
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
