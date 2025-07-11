'use client'

import { cn } from '@/lib/utils'
import { createPromptApi } from '@/requests'
import { LucideLoaderCircle } from 'lucide-react'
import { memo, ReactNode, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import CustomInput from '../CustomInput'
import { Button } from '../ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'

interface CreatePromptDrawerProps {
  trigger: ReactNode
  className?: string
  refresh?: () => void
}

function CreatePromptDrawer({ trigger, refresh, className }: CreatePromptDrawerProps) {
  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
    control,
    clearErrors,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      content: '',
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // content must not be empty
      if (!data.content.trim()) {
        setError('content', {
          type: 'manual',
          message: 'Content is required',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // create prompt
  const handleCreatePrompt: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setSaving(true)
      toast.loading('Creating prompt...', { id: 'create-prompt' })

      try {
        await createPromptApi(data)
        toast.success('Create prompt successfully!', { id: 'create-prompt' })
        setOpen(false)
        reset()

        if (refresh) refresh()
      } catch (err: any) {
        toast.error('Failed to create prompt', { id: 'create-prompt' })
        console.log(err)
      } finally {
        // stop loading
        setSaving(false)
      }
    },
    [handleValidate, refresh, reset]
  )

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className={cn(className)}>
        <div className="px-21-2 mx-auto w-full max-w-sm">
          {/* MARK: Header */}
          <DrawerHeader>
            <DrawerTitle className="text-center">Create Prompt</DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-3">
            {/* MARK: Content */}
            <CustomInput
              id="content"
              label="Content"
              disabled={saving}
              register={register}
              errors={errors}
              onFocus={() => clearErrors('content')}
              control={control}
            />
          </div>

          {/* MARK: Drawer Footer */}
          <DrawerFooter className="mb-21 px-0">
            <div className="gap-21-2 mt-3 flex items-center justify-end">
              <DrawerClose>
                <Button
                  variant="secondary"
                  className="px-21-2 h-10 rounded-md text-[13px] font-semibold"
                  onClick={() => {
                    setOpen(false)
                    reset()
                  }}
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                disabled={saving}
                variant="default"
                className="px-21-2 h-10 min-w-[60px] rounded-md text-[13px] font-semibold"
                onClick={handleSubmit(handleCreatePrompt)}
              >
                {saving ? (
                  <LucideLoaderCircle
                    size={20}
                    className="text-muted-foreground animate-spin"
                  />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default memo(CreatePromptDrawer)
