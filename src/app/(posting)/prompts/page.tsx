'use client'

import CreatePromptDrawer from '@/components/drawers/CreatePromptDrawer'
import PromptCard from '@/components/PromptCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppSelector } from '@/hooks/reduxHook'
import { LucidePlus } from 'lucide-react'
import { useState } from 'react'

function PromptsPage() {
  // store
  const prompts = useAppSelector(state => state.posting.prompts)

  // states
  const [search, setSearch] = useState('')

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-primary text-center text-3xl font-bold">Prompt Library</h1>

      {/* Filters */}
      <Input
        placeholder="Search content..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Prompt Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {prompts
          .filter(p => p.content.toLowerCase().trim().includes(search.toLowerCase().trim()))
          .map(p => (
            <PromptCard
              prompt={p}
              key={p._id}
            />
          ))}
      </div>

      <CreatePromptDrawer
        trigger={
          <Button
            variant="default"
            className="fixed right-2 bottom-[calc(78px)] z-20 h-10 rounded-full xl:right-[calc(50%-640px+21px)]"
          >
            <LucidePlus size={24} />
            Create Prompt
          </Button>
        }
      />
    </div>
  )
}

export default PromptsPage
