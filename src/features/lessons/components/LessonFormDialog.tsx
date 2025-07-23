"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { LessonStatus } from "@/drizzle/schema";

import { ReactNode, useState } from "react";
import LessonForm from "./LessonForm";



const LessonFormDialog = ({
    children,
    sections,
    defaultSectionId,
    lesson }:
    {
        children: ReactNode,
        defaultSectionId: string,
        sections?: { id: string, name: string }[],
        lesson?: {
            id: string,
            name: string,
            status: LessonStatus,
            youtubeVideoId: string,
            description: string | null,
            sectionId : string
        }
    }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{lesson == null ? "new Section" : `Edit ${lesson.name}`}</DialogTitle>
                </DialogHeader>
                <div className="mt-6">
                    <LessonForm
                        sections={sections!}
                        lesson={lesson}
                        defaultSectionId={defaultSectionId}
                        onSuccess={() => setIsOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LessonFormDialog;