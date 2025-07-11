'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Page } from '@/lib/db'
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
  refresh?: () => void
}

function PageCard({ page, className, refresh }: PageCardProps) {
  const [loading, setLoading] = useState<boolean>(false)

  // MARK: delete page
  const handleDeletePage = useCallback(async () => {
    setLoading(true)
    toast.loading('Deleting page...', { id: 'delete-page' })

    try {
      await deletePageApi(page._id)
      toast.success('Deleted page successfully!', { id: 'delete-page' })

      if (refresh) refresh()
    } catch (err: any) {
      toast.error('Failed to delete page', { id: 'delete-page' })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page._id, refresh])

  return (
    <Card
      className={cn(
        'group border-border/50 relative overflow-hidden border transition-shadow hover:shadow-md',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3
              className="cursor-pointer text-lg font-semibold"
              onClick={() => copy(page.name)}
            >
              {page.name}
            </h3>
            <div className="text-muted-foreground text-sm">
              Key:{' '}
              <span
                className="cursor-pointer underline"
                onClick={() => copy(page.key)}
              >
                {page.key}
              </span>
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
                refresh={refresh}
                trigger={
                  <Button
                    variant="ghost"
                    className="w-full justify-normal"
                  >
                    <LucidePencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                }
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
