"use client";
import SortableList, { SortableItem } from '@/components/SortableList'
import { SectionStatus } from '@/drizzle/schema'
import { EyeClosedIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import SectionFormDialog from './SectionFormDialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import ActionButton from '@/components/ActionButton'
import { cn } from '@/lib/utils'
import { deleteSection, updateSectionOrder } from '../actions/sections'

const SortableSectionList = ({
    courseId,
     sections}  : {
        courseId : string, 
        sections : {
            id :string,
             name: string, 
             status : SectionStatus
        }[]
    }) => {
  return (
    <SortableList 
    items={sections} 
    onOrderChange={updateSectionOrder}
    > 
    {items => items.map(section => (

      <SortableItem key={section.id} id={section.id} className='flex items-center gap-1' >
            <div className={cn("contents",
                    section.status == "private" && "text-muted-foreground")}>
                    {section.status === "private" &&
                      <EyeClosedIcon className='size-4' />}
                    {section.name}
                  </div>
                  <SectionFormDialog courseId={courseId} section={section}>
                    <DialogTrigger asChild>
                      <Button
                        variant={"outline"}
                        size={"sm"}
                        className='ml-auto'>
                        Edit
                      </Button>
                    </DialogTrigger>
                  </SectionFormDialog>  
                  <ActionButton 
                  action={deleteSection.bind(null, section.id)}
                  requireAreYouSure
                  variant={"destructiveOutline"}
                  size={"sm"}
                  >
                    <Trash2Icon />
                    <span className='sr-only'>Delete</span>
                  </ActionButton>
      </SortableItem>
    ))}
    </SortableList>
  )
}

export default SortableSectionList