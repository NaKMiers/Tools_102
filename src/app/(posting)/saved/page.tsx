'use client'

import ArticleCard from '@/components/ArticleCard'
import CreatePageDrawer from '@/components/drawers/CreatePageDrawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppSelector } from '@/hooks/reduxHook'
import { LucidePlus } from 'lucide-react'
import { useEffect, useState } from 'react'

function SavedPage() {
  // store
  const { pages, articles } = useAppSelector(state => state.posting)

  // states
  const [search, setSearch] = useState('')
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [openPageFilter, setOpenPageFilter] = useState<boolean>(false)

  useEffect(() => {
    setSelectedPages(pages.map(page => page._id))
  }, [pages])

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="text-primary text-center text-3xl font-bold">Saved Articles</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search content..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />

        {/* Page Filter */}
        <div className="relative">
          <Button
            variant="outline"
            className="w-[200px] justify-start"
            onClick={() => setOpenPageFilter(!openPageFilter)}
          >
            {selectedPages.length > 0
              ? `${selectedPages.length} page${selectedPages.length > 1 ? 's' : ''} selected`
              : 'Filter by pages'}
          </Button>
          {openPageFilter && (
            <div className="bg-secondary absolute z-10 mt-2 w-[200px] rounded-lg border p-2 shadow">
              {/* Select All */}
              <label className="hover:bg-muted flex cursor-pointer items-center gap-2 p-1 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={selectedPages.length === pages.length}
                  onChange={() => {
                    if (selectedPages.length === pages.length) {
                      setSelectedPages([])
                    } else {
                      setSelectedPages(pages.map(page => page._id))
                    }
                  }}
                />
                Select All
              </label>

              <div className="my-1 border-t" />

              {/* Individual items */}
              {pages.map(page => (
                <label
                  key={page._id}
                  className="hover:bg-muted flex cursor-pointer items-center gap-2 p-1 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page._id)}
                    onChange={() => {
                      setSelectedPages(prev =>
                        prev.includes(page._id)
                          ? prev.filter(id => id !== page._id)
                          : [...prev, page._id]
                      )
                    }}
                  />
                  {page.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Page Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles
          .filter(a => {
            const key =
              a.title.toLowerCase().trim() +
              a.desc.toLowerCase().trim() +
              a.content.toLowerCase().trim() +
              (a.author || '').toLowerCase().trim()
            return (
              key.includes(search.toLowerCase().trim()) && a?.pageId && selectedPages.includes(a.pageId)
            )
          })
          .map(article => (
            <ArticleCard
              article={article}
              options={pages}
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
