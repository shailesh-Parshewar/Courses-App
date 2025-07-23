"use client";

import SortableList, { SortableItem } from '@/components/SortableList'
import { LessonStatus } from '@/drizzle/schema'
import { EyeClosedIcon, Trash2Icon, VideoIcon } from 'lucide-react'
import React from 'react'

import { DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import ActionButton from '@/components/ActionButton'
import { cn } from '@/lib/utils'
import LessonFormDialog from './LessonFormDialog';
import { deleteLesson } from '../db/lessons';



const SortableLessonList = ({
  sections,
  lessons
}: {
  sections: {
    id: string,
    name: string,
  }[]
  lessons: {
    id: string,
    name: string,
    status: LessonStatus
    youtubeVideoId : string
    description : string | null
    sectionId : string
  }[]
}) => {
  return (
    <SortableList
      items={lessons}
      onOrderChange={updateLessonsOrder}
    >
      {items => items.map(lesson => (

        <SortableItem 
        key={lesson.id} 
        id={lesson.id} 
        className='flex items-center gap-1' >
          <div className={cn("contents",  lesson.status == "private"   && "text-muted-foreground")}> 
            {lesson.status === "private" && <EyeClosedIcon className='size-4' />}
            {lesson.status === "preview" && <VideoIcon className='size-4'/>}
            {lesson.name}
          </div>

          <LessonFormDialog lesson={lesson} sections={sections} defaultSectionId={lesson.sectionId} >
            <DialogTrigger asChild>
              <Button
                variant={"outline"}
                size={"sm"}
                className='ml-auto'>
                Edit
              </Button>
            </DialogTrigger>
          </LessonFormDialog>
          <ActionButton
            action={deleteLesson.bind(null, lesson.id)}
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

export default SortableLessonList