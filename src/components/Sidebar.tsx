import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { LucideArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface SidebarProps {
  trigger: ReactNode
  className?: string
}

const routes = [
  { name: 'Home', path: '/' },
  { name: 'Posting', path: '/posting' },
  { name: 'Saved', path: '/saved' },
  { name: 'Prompts', path: '/prompts' },
  { name: 'Pages', path: '/pages' },
]

function Sidebar({ trigger, className }: SidebarProps) {
  return (
    <Sheet modal>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="left"
        className={cn(className)}
      >
        <SheetHeader>
          <SheetTitle>Posting</SheetTitle>
          <SheetDescription>Auto Posting To Facebook Pages</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          {routes.map(route => (
            <Link
              href={route.path}
              className="border-muted-foreground px-21-2 hover:bg-secondary hover:text-primary trans-200 flex flex-row items-center justify-baseline border-b py-2 text-sm font-medium capitalize"
              key={route.path}
            >
              <span>{route.name}</span>
              <LucideArrowRight className="ml-auto h-4 w-4" />
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Sidebar
