'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

function PostingLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <div>
      {children}

      <div className="fixed bottom-10 left-10 flex flex-col gap-4">
        {['posting', 'saved', 'prompts', 'pages'].map(route => (
          <Link
            href={'/' + route}
            className="border-primary rounded-full border-2 px-2.5 py-1.5 text-center text-sm font-semibold capitalize"
            key={route}
          >
            {route}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PostingLayout
