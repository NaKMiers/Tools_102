'use client'

import { useAppDispatch } from '@/hooks/reduxHook'
import { refresh } from '@/lib/reducers/postingReducer'
import { cn } from '@/lib/utils'
import { createPageApi } from '@/requests'
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

interface CreatePageDrawerProps {
  trigger: ReactNode
  className?: string
}

function CreatePageDrawer({ trigger, className }: CreatePageDrawerProps) {
  // hooks
  const dispatch = useAppDispatch()

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
      pageId: '',
      name: '',
      key: '',
      color: '#000000',
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // pageId must not be empty
      if (!data.pageId.trim()) {
        setError('name', {
          type: 'manual',
          message: 'Page ID is required',
        })
        isValid = false
      }

      // name must not be empty
      if (!data.name.trim()) {
        setError('name', {
          type: 'manual',
          message: 'Name is required',
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

  // create page
  const handleCreatePage: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setSaving(true)
      toast.loading('Creating page...', { id: 'create-page' })

      try {
        await createPageApi(data)
        toast.success('Create page successfully!', { id: 'create-page' })
        setOpen(false)
        reset()

        dispatch(refresh())
      } catch (err: any) {
        toast.error('Failed to create page', { id: 'create-page' })
        console.log(err)
      } finally {
        // stop loading
        setSaving(false)
      }
    },
    [dispatch, handleValidate, reset]
  )

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className={cn(className)}>
        <div className="px-21-2 mx-auto w-full max-w-md">
          {/* MARK: Header */}
          <DrawerHeader>
            <DrawerTitle className="text-center">Create Page</DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-3">
            {/* MARK: Page ID */}
            <CustomInput
              id="pageId"
              label="Page ID"
              disabled={saving}
              register={register}
              errors={errors}
              onFocus={() => clearErrors('pageId')}
              control={control}
            />

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
              type="textarea"
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
                onClick={handleSubmit(handleCreatePage)}
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

export default memo(CreatePageDrawer)
