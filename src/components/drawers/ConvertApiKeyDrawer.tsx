'use client'

import { useAppDispatch } from '@/hooks/reduxHook'
import { copy } from '@/lib/toolsClient'
import { cn } from '@/lib/utils'
import { convertKeyApi, createPageApi } from '@/requests'
import { LucideLoaderCircle, LucideSave } from 'lucide-react'
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
import { refresh } from '@/lib/reducers/postingReducer'

interface ConvertApiKeyDrawerProps {
  trigger: ReactNode
  className?: string
}

type ResultType = {
  pageId: string
  accessToken: string
  name: string
}

function ConvertApiKeyDrawer({ trigger, className }: ConvertApiKeyDrawerProps) {
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
      clientId: '',
      clientSecret: '',
      token: '',
    },
  })

  // states
  const [result, setResult] = useState<ResultType[] | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<number>(NaN)

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // clientId must not be empty
      if (!data.clientId.trim()) {
        setError('clientId', {
          type: 'manual',
          message: 'App ID is required',
        })
        isValid = false
      }

      // clientSecret must not be empty
      if (!data.clientSecret.trim()) {
        setError('clientSecret', {
          type: 'manual',
          message: 'Client Secret is required',
        })
        isValid = false
      }

      // token must not be empty
      if (!data.token.trim()) {
        setError('token', {
          type: 'manual',
          message: 'Token is required',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Convert API key
  const handleConvertKey: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setLoading(true)
      toast.loading('Converting key...', { id: 'convert-key' })

      try {
        const {
          data: { data: result },
        } = await convertKeyApi(data.clientId, data.clientSecret, data.token)
        toast.success('Convert key successfully!', { id: 'convert-key' })
        setResult(
          Array.isArray(result)
            ? result.map(({ id, name, access_token }) => ({
                pageId: id,
                name,
                accessToken: access_token,
              }))
            : [{ pageId: result.id, name: result.name, accessToken: result.access_token }]
        )
      } catch (err: any) {
        toast.error('Failed to convert key', { id: 'convert-key' })
        console.log(err)
      } finally {
        // stop loading
        setLoading(false)
      }
    },
    [handleValidate]
  )

  // MARK: Create Page
  const handleCreatePage = useCallback(async (pageId: string, name: string, key: string) => {
    // start loading
    setLoading(true)
    toast.loading('Creating page...', { id: 'create-page' })

    try {
      await createPageApi({ pageId, name, key, color: '#000000' })
      toast.success('Create page successfully!', { id: 'create-page' })
    } catch (err: any) {
      toast.error('Failed to create page', { id: 'create-page' })
      console.log(err)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [])

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
            <DrawerTitle className="text-center">
              Convert Temporary Facebook API Key to Lifeless API Key
            </DrawerTitle>
          </DrawerHeader>

          {!result ? (
            <div className="flex flex-col gap-3">
              {/* MARK: Client ID */}
              <CustomInput
                id="clientId"
                label="App ID"
                disabled={loading}
                register={register}
                errors={errors}
                onFocus={() => clearErrors('clientId')}
                control={control}
              />

              {/* MARK: Client Secret */}
              <CustomInput
                id="clientSecret"
                label="Client Secret"
                disabled={loading}
                register={register}
                errors={errors}
                onFocus={() => clearErrors('clientSecret"')}
                control={control}
              />

              {/* MARK: Key */}
              <CustomInput
                id="token"
                type="textarea"
                label="Token"
                disabled={loading}
                register={register}
                errors={errors}
                onFocus={() => clearErrors('token')}
                control={control}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {result.map((item, index) => (
                <div
                  className="border-primary p-21-2 relative flex flex-col gap-1 rounded-lg border shadow-md"
                  key={index}
                >
                  <Button
                    onClick={() => handleCreatePage(item.pageId, item.name, item.accessToken)}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full p-0.5"
                  >
                    <LucideSave />
                  </Button>

                  <p
                    onClick={() => copy(item.name)}
                    className="cursor-pointer font-medium"
                  >
                    {item.name}
                  </p>
                  <p
                    onClick={() => copy(item.pageId)}
                    className="cursor-pointer underline"
                  >
                    {item.pageId}
                  </p>
                  <p
                    onClick={() => copy(item.accessToken)}
                    className="cursor-pointer overflow-hidden text-sm text-ellipsis"
                  >
                    {item.accessToken}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* MARK: Drawer Footer */}
          <DrawerFooter className="mb-21 px-0">
            <div className="gap-21-2 mt-3 flex items-center justify-end">
              <DrawerClose>
                <Button
                  variant="secondary"
                  className="px-21-2 h-10 rounded-md text-[13px] font-semibold"
                  onClick={() => {
                    setOpen(false)
                    dispatch(refresh())
                    reset()
                  }}
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                disabled={loading}
                variant="default"
                className="px-21-2 h-10 min-w-[60px] rounded-md text-[13px] font-semibold"
                onClick={handleSubmit(handleConvertKey)}
              >
                {loading ? (
                  <LucideLoaderCircle
                    size={20}
                    className="text-muted-foreground animate-spin"
                  />
                ) : (
                  'Convert'
                )}
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default memo(ConvertApiKeyDrawer)
