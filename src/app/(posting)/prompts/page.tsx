'use client'

import CreatePromptDrawer from '@/components/drawers/CreatePromptDrawer'
import PromptCard from '@/components/PromptCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Prompt } from '@/lib/db'
import { getPromptsApi } from '@/requests'
import { LucidePlus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

function PromptsPage() {
  const [search, setSearch] = useState('')
  const [prompts, setPrompts] = useState<Prompt[]>([])

  const fetchPrompts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      const query = params.toString()

      const { prompts } = await getPromptsApi(query)

      console.log('Fetched prompts:', prompts)

      setPrompts(prompts)
    } catch (err: any) {
      toast.error(err.message)
      setPrompts([])
    }
  }, [search])

  const reset = useCallback(() => {
    setSearch('')
    setPrompts([])
  }, [])

  useEffect(() => {
    fetchPrompts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        fetchPrompts()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fetchPrompts])

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-primary text-center text-3xl font-bold">Prompt Library</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          placeholder="Search content..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="col-span-full flex justify-end gap-2">
          <Button onClick={fetchPrompts}>Search</Button>
          <Button onClick={reset}>Reset</Button>
        </div>
      </div>

      {/* Prompt Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map(p => (
          <PromptCard
            prompt={p}
            refresh={fetchPrompts}
            key={p._id}
          />
        ))}
      </div>

      <CreatePromptDrawer
        refresh={fetchPrompts}
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
