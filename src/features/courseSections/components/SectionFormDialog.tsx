"use client";

import { Dialog,
   DialogContent,
   DialogHeader, 
   DialogTitle } from "@/components/ui/dialog";
import { SectionStatus } from "@/drizzle/schema";

import { ReactNode, useState } from "react";
import SectionForm from "./SectionForm";


const SectionFormDialog = ({
  children,
   courseId,
    section } :
     { children : ReactNode, 
     courseId: string,
     section?: {id : string, name : string, status: SectionStatus }
     }) => {
      const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{section == null ? "new Section" : `Edit ${section.name}`}</DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          <SectionForm 
          section={section} 
          courseId={courseId}
          onSuccess={() => setIsOpen(false)}
           />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SectionFormDialog;