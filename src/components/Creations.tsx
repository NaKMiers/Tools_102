'use client'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { LucideBookCheck, LucidePlus, LucideText } from 'lucide-react'
import CreatePageDrawer from './drawers/CreatePageDrawer'
import CreatePromptDrawer from './drawers/CreatePromptDrawer'
import { Button } from './ui/button'

function Creations() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="fixed right-2 bottom-[calc(78px)] z-20 h-10 cursor-pointer rounded-full xl:right-[calc(50%-640px+21px)]">
          <div className="bg-primary text-secondary aspect-square rounded-full p-2">
            <LucidePlus size={24} />
          </div>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-center">
              <p className="font-semibold">Tools 102</p>
            </DrawerTitle>
          </DrawerHeader>

          <div className="my-1 flex flex-col gap-2 px-4">
            <CreatePromptDrawer
              trigger={
                <Button variant="outline">
                  <LucideText />
                  Create Prompt
                </Button>
              }
            />

            <CreatePageDrawer
              trigger={
                <Button variant="outline">
                  <LucideBookCheck />
                  Create Page
                </Button>
              }
            />
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default Creations
