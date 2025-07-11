import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch } from '@/hooks/reduxHook'
import { Article, Page } from '@/lib/db'
import { refresh } from '@/lib/reducers/postingReducer'
import { copy } from '@/lib/toolsClient'
import { cn } from '@/lib/utils'
import { removeSavedArticleApi, saveArticleApi } from '@/requests'
import { LucideBookmark, LucideCloudUpload, LucideLoaderCircle, LucideX } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import PostToPageModal from './PostToPageModal'

interface ArticleCardProps {
  article: Article
  options: Page[]
  saved?: boolean
  className?: string
}

function ArticleCard({ options, article, saved, className }: ArticleCardProps) {
  // hooks
  const dispatch = useAppDispatch()

  // states
  const [saving, setSaving] = useState<boolean>(false)
  const [removing, setRemoving] = useState<boolean>(false)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  // MARK: Save article
  const handleSaveArticle = useCallback(
    async (optionId: string) => {
      // start loading
      setSaving(true)
      toast.loading('Saving article...', { id: 'save-article' })

      try {
        await saveArticleApi(article, optionId)
        toast.success('Save article successfully!', { id: 'save-article' })

        dispatch(refresh())
      } catch (err: any) {
        toast.error('Failed to save article', { id: 'save-article' })
        console.log(err)
      } finally {
        // stop loading
        setSaving(false)
      }
    },
    [dispatch, article]
  )

  // MARK: Remove Saved Articles
  const handleRemoveSaveArticle = useCallback(async () => {
    // start loading
    setRemoving(true)
    toast.loading('Removing article...', { id: 'remove-article' })

    try {
      await removeSavedArticleApi(article._id)
      toast.success('Remove article successfully!', { id: 'remove-article' })

      dispatch(refresh())
    } catch (err: any) {
      toast.error('Failed to remove article', { id: 'remove-article' })
      console.log(err)
    } finally {
      // stop loading
      setRemoving(false)
    }
  }, [dispatch, article])

  return (
    <>
      <Card
        className={cn('group overflow-hidden py-0 pb-8 transition-shadow hover:shadow-lg', className)}
      >
        <div className="aspect-video overflow-hidden">
          <Image
            src={article.thumbnail || 'https://via.placeholder.com/640x360?text=No+Image'}
            alt={article.title || 'No Image'}
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
        </div>
        <CardHeader>
          <h3
            className="cursor-pointer text-lg font-semibold hover:underline"
            onClick={() => copy(article.title)}
          >
            {article.title || 'No Title'}
          </h3>
          <p className="text-muted-foreground text-sm italic">
            {article.author || 'Unknown'} • {new Date(article.date).toLocaleString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p
            className="cursor-pointer"
            onClick={() => copy(article.date)}
          >
            {article.desc || 'No Description'}
          </p>
          <Link
            href={article.link}
            target="_blank"
            className="trans-200 line-clamp-3 max-w-md cursor-pointer overflow-hidden text-ellipsis text-sky-500 underline hover:text-blue-500 hover:underline"
            onClick={() => copy(article.link)}
          >
            {article.link}
          </Link>
          <p
            className="text-muted-foreground cursor-pointer"
            onClick={() => copy(article.content)}
          >
            {article.content || 'No Content'}
          </p>
        </CardContent>
        <CardFooter className="flex flex-1 items-end justify-between">
          {/* Save Button */}
          {saved ? (
            <div>
              {saving ? (
                <LucideLoaderCircle className="text-muted-foreground animate-spin" />
              ) : (
                <LucideX
                  onClick={handleRemoveSaveArticle}
                  className="cursor-pointer text-rose-500"
                />
              )}
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer outline-none">
                {saving ? (
                  <LucideLoaderCircle className="text-muted-foreground animate-spin" />
                ) : (
                  <LucideBookmark />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="cursor-pointer">
                {options.map(option => (
                  <DropdownMenuItem
                    className="justify-between"
                    onClick={() => handleSaveArticle(option._id)}
                    key={option._id}
                  >
                    {option.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Post Button */}
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer outline-none">
              <LucideCloudUpload />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="cursor-pointer">
              {options.map(option => (
                <DropdownMenuItem
                  className="justify-between"
                  onClick={() => {
                    setSelectedPage(option)
                    setModalOpen(true)
                  }}
                  key={option._id}
                >
                  {option.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      {selectedPage && (
        <PostToPageModal
          open={modalOpen}
          close={() => setModalOpen(false)}
          article={article}
          page={selectedPage}
        />
      )}
    </>
  )
}

export default ArticleCard
