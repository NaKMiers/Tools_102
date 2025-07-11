'use client'

import { toast } from 'sonner'

export const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  toast(`Copied: ${text}`)
}
