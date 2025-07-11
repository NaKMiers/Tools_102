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
import { Page } from '@/lib/db'
import { refresh } from '@/lib/reducers/postingReducer'
import { copy } from '@/lib/toolsClient'
import { cn } from '@/lib/utils'
import { deletePageApi } from '@/requests'
import { LucideEllipsis, LucidePencil, LucideTrash } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import UpdatePageDrawer from './drawers/UpdatePageDrawer'

interface PageCardProps {
  page: Page
  className?: string
}

function PageCard({ page, className }: PageCardProps) {
  // hooks
  const dispatch = useAppDispatch()

  // states
  const [loading, setLoading] = useState<boolean>(false)

  // MARK: delete page
  const handleDeletePage = useCallback(async () => {
    setLoading(true)
    toast.loading('Deleting page...', { id: 'delete-page' })

    try {
      await deletePageApi(page._id)
      toast.success('Deleted page successfully!', { id: 'delete-page' })

      dispatch(refresh())
    } catch (err: any) {
      toast.error('Failed to delete page', { id: 'delete-page' })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [dispatch, page._id])

  return (
    <Card
      className={cn(
        'group border-border/50 relative overflow-hidden border transition-shadow hover:shadow-md',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <h3
              className="cursor-pointer text-lg font-semibold"
              onClick={() => copy(page.name)}
            >
              {page.name}
            </h3>
            <div className="text-muted-foreground text-sm">
              Page ID:{' '}
              <p
                className="cursor-pointer underline"
                onClick={() => copy(page.pageId)}
              >
                {page.pageId}
              </p>
            </div>
            <div className="text-muted-foreground text-sm">
              Key:{' '}
              <p
                className="cursor-pointer text-ellipsis underline"
                onClick={() => copy(page.key)}
              >
                {page.key.slice(0, 20) + '...'}
              </p>
            </div>
          </div>

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
              <UpdatePageDrawer
                page={page}
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
                onClick={handleDeletePage}
              >
                <LucideTrash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Color:</span>
          <div
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: page.color }}
            title={page.color}
            onClick={() => copy(page.color)}
          />
          <span
            className="text-muted-foreground cursor-pointer text-xs hover:underline"
            onClick={() => copy(page.color)}
          >
            {page.color}
          </span>
        </div>
      </CardContent>

      <CardFooter className="text-muted-foreground flex justify-between text-xs">
        <span>Created: {page.createdAt?.slice(0, 10) || '—'}</span>
        <span>Updated: {page.updatedAt?.slice(0, 10) || '—'}</span>
      </CardFooter>
    </Card>
  )
}

export default PageCard
