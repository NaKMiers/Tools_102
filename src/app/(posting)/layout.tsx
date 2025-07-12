'use client'

import PostingInitProvider from '@/components/providers/PostingInitProvider'
import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { LucideMenu } from 'lucide-react'
import { ReactNode } from 'react'

function PostingLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <PostingInitProvider>
      {children}

      <Sidebar
        trigger={
          <Button className="fixed bottom-[calc(78px)] left-2 z-20 h-10 cursor-pointer rounded-full xl:left-[calc(50%-640px+21px)]">
            <LucideMenu />
          </Button>
        }
      />
    </PostingInitProvider>
  )
}

export default PostingLayout
