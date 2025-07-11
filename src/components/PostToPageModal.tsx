'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppSelector } from '@/hooks/reduxHook'
import { Article, Page } from '@/lib/db'
import { postPostStep1Api, postPostStep2Api } from '@/requests'
import { LucideLoaderCircle } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface PostToPageModalProps {
  open: boolean
  close: () => void
  page: Page
  article: Article
}

function PostToPageModal({ open, close, page, article }: PostToPageModalProps) {
  // hooks
  const { prompts } = useAppSelector(state => state.posting)
  const [promptId, setPromptId] = useState<string>('')

  // states
  const [loading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<number>(1)
  const [data, setData] = useState<any>(null)

  // MARK: Post Step 1
  const handlePostStep1 = useCallback(async () => {
    // start loading
    setLoading(true)

    try {
      const { content, imageUrl } = await postPostStep1Api(page._id, promptId, article)
      toast.success('Completed Step 1!')

      setData({
        content,
        imageUrl,
      })

      setStep(2)
    } catch (err: any) {
      console.log(err)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [article, page._id, promptId])

  const handlePostStep2 = useCallback(async () => {
    // start loading
    setLoading(true)

    try {
      await postPostStep2Api(page._id, data)
      toast.success('Posting successfully!')

      // close modal
      close()
    } catch (err: any) {
      console.log(err)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [data, close, page._id])
  return (
    <Dialog
      open={open}
      onOpenChange={close}
    >
      {step === 1 && (
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>
              Post to <span className="text-primary">{page.name}</span>
            </DialogTitle>
          </DialogHeader>

          <p className="text-center">{article.title}</p>

          {/* Prompt Selector */}
          <div className="flex flex-col items-center gap-2 pt-4">
            <label className="text-sm font-medium">Select Prompt</label>
            <Select
              value={promptId}
              onValueChange={setPromptId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a prompt" />
              </SelectTrigger>
              <SelectContent>
                {prompts.map(p => (
                  <SelectItem
                    key={p._id}
                    value={p._id}
                  >
                    {p.content.slice(0, 50)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              disabled={!promptId || loading}
              onClick={handlePostStep1}
            >
              {loading ? (
                <LucideLoaderCircle
                  size={20}
                  className="text-muted-foreground animate-spin"
                />
              ) : (
                'Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}

      {step === 2 && data && (
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>
              Post to <span className="text-primary">{page.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[200px] overflow-y-auto">
            <p className="whitespace-pre-line">{data.content}</p>
          </div>
          <div className="aspect-video rounded-xl">
            <Image
              src={data.imageUrl}
              alt="Posting"
              className="h-full w-full object-cover"
              width={1920}
              height={1080}
            />
          </div>

          <DialogFooter>
            <Button
              disabled={!promptId || loading}
              onClick={handlePostStep2}
            >
              {loading ? (
                <LucideLoaderCircle
                  size={20}
                  className="text-muted-foreground animate-spin"
                />
              ) : (
                'Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default PostToPageModal
