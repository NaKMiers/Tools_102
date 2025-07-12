'use client'

import ConvertApiKeyDrawer from '@/components/drawers/ConvertApiKeyDrawer'
import CreatePageDrawer from '@/components/drawers/CreatePageDrawer'
import PageCard from '@/components/PageCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppSelector } from '@/hooks/reduxHook'
import { LucideChevronsLeftRightEllipsis, LucidePlus } from 'lucide-react'
import { useState } from 'react'

function PagesPage() {
  // store
  const pages = useAppSelector(state => state.posting.pages)

  // states
  const [search, setSearch] = useState('')

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="text-primary text-center text-3xl font-bold">Page Library</h1>

      {/* Filters */}
      <div className="gap-21-2 flex items-center">
        <Input
          placeholder="Search content..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <ConvertApiKeyDrawer
          trigger={
            <Button className="">
              <LucideChevronsLeftRightEllipsis className="h-4 w-4" />
              Convert API Key
            </Button>
          }
          key={new Date().getTime()}
        />
      </div>

      {/* Page Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pages
          .filter(p => p.name?.toLowerCase().trim().includes(search?.toLowerCase().trim()))
          .map(p => (
            <PageCard
              page={p}
              key={p._id}
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

export default PagesPage
