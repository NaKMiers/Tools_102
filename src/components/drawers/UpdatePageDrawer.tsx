'use client'

import { Page } from '@/lib/db'
import { cn } from '@/lib/utils'
import { updatePageApi } from '@/requests'
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

interface UpdatePageDrawerProps {
  trigger: ReactNode
  className?: string
  page: Page
  refresh?: () => void
}

function UpdatePageDrawer({ trigger, page, refresh, className }: UpdatePageDrawerProps) {
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
      name: page.name || '',
      key: page.key || '',
      color: page.color || '',
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // name must not be empty
      if (!data.name.trim()) {
        setError('name', {
          type: 'manual',
          message: 'Content is required',
        })
        isValid = false
      }

      // key must not be empty
      if (!data.key.trim()) {
        setError('key', {
          type: 'manual',
          message: 'Key is required',
        })
        isValid = false
      }

      // color must not be empty
      if (!data.color.trim()) {
        setError('color', {
          type: 'manual',
          message: 'Color is required',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // create budget
  const handleCreateBudget: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setSaving(true)
      toast.loading('Updating page...', { id: 'update-page' })

      try {
        await updatePageApi(page._id, data)
        toast.success('Update page successfully!', { id: 'update-page' })
        setOpen(false)
        reset()

        if (refresh) refresh()
      } catch (err: any) {
        toast.error('Failed to update budget', { id: 'update-page' })
        console.log(err)
      } finally {
        // stop loading
        setSaving(false)
      }
    },
    [handleValidate, reset, refresh, page._id]
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
            <DrawerTitle className="text-center">Update Page</DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-3">
            {/* MARK: Name */}
            <CustomInput
              id="name"
              label="Name"
              disabled={saving}
              register={register}
              errors={errors}
              onFocus={() => clearErrors('name')}
              control={control}
            />

            {/* MARK: Key */}
            <CustomInput
              id="key"
              label="API Key"
              disabled={saving}
              register={register}
              errors={errors}
              onFocus={() => clearErrors('key')}
              control={control}
            />

            {/* MARK: Color */}
            <CustomInput
              id="color"
              type="color"
              label="Color"
              disabled={saving}
              register={register}
              errors={errors}
              onFocus={() => clearErrors('color')}
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
                onClick={handleSubmit(handleCreateBudget)}
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

export default memo(UpdatePageDrawer)
