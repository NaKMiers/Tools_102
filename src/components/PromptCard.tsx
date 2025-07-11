'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch } from '@/hooks/reduxHook'
import { Prompt } from '@/lib/db'
import { refresh } from '@/lib/reducers/postingReducer'
import { copy } from '@/lib/toolsClient'
import { cn } from '@/lib/utils'
import { deletePromptApi } from '@/requests'
import { LucideEllipsis, LucidePencil, LucideTrash } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import UpdatePromptDrawer from './drawers/UpdatePromptDrawer'

interface PromptCardProps {
  prompt: Prompt
  className?: string
}

function PromptCard({ prompt, className }: PromptCardProps) {
  // hooks
  const dispatch = useAppDispatch()

  // states
  const [loading, setLoading] = useState<boolean>(false)

  // MARK: delete prompt
  const handleDeletePrompt = useCallback(async () => {
    // start loading
    setLoading(true)
    toast.loading('Deleting prompt...', { id: 'delete-prompt' })

    try {
      await deletePromptApi(prompt._id)
      toast.success('Update prompt successfully!', { id: 'delete-prompt' })

      dispatch(refresh())
    } catch (err: any) {
      toast.error('Failed to delete prompt', { id: 'delete-prompt' })
      console.log(err)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [dispatch, prompt._id])

  return (
    <Card
      className={cn(
        'group border-border/50 relative overflow-hidden border transition-shadow hover:shadow-md',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="line-clamp-2 text-lg font-semibold">{prompt.content.slice(0, 50)}...</h3>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <LucideEllipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <UpdatePromptDrawer
                prompt={prompt}
                trigger={
                  <Button
                    variant="ghost"
                    className="w-full justify-normal"
                  >
                    <LucidePencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                }
                key={new Date().getTime()}
              />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive h-9"
                onClick={handleDeletePrompt}
              >
                <LucideTrash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="text-muted-foreground text-sm">
        <p
          className="line-clamp-6 cursor-pointer"
          onClick={() => copy(prompt.content)}
        >
          {prompt.content}
        </p>
      </CardContent>

      <CardFooter className="text-muted-foreground flex justify-between text-xs">
        <span>Created: {prompt.createdAt?.slice(0, 10) || '—'}</span>
        <span>Updated: {prompt.updatedAt?.slice(0, 10) || '—'}</span>
      </CardFooter>
    </Card>
  )
}

export default PromptCard
