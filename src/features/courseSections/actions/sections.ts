"use server";

import { getCurrentUser } from "@/services/clerk";
import {
   canCreateSection,
   canDeleteSection,
   canUpdateSection
} from "../permissions/section";
import { sectionSchema } from "../schema/section";
import {
   insertSection,
   updateSection as updateSectionDB,
   deleteSection as deleteSectionDB,
   updateSectionOrder as updateSectionOrderDB,
   getNextCourseSectionOrder
} from "../db/sections";
import z from "zod";



export async function createSection(courseId: string, unsafeData: z.infer<typeof sectionSchema>) {
   const { success, data } = sectionSchema.safeParse(unsafeData);

   if (!success) {
      return { error: true, message: "there was an error creating your course." }
   }
   else if (!canCreateSection(await getCurrentUser())) {
      return { error: true, message: "you are not authorised to create courses." }
   }

   const order = await getNextCourseSectionOrder(courseId);
   await insertSection({ ...data, courseId, order });


   return { error: false, message: "section created successfully" }
}


export async function updateSection(id: string, 
   unsafeData: z.infer<typeof sectionSchema>) {

   const { success, data } = sectionSchema.safeParse(unsafeData);

   if (!success) {
      return { error: true, message: "there was an error updating your course." }
   }
   else if (!canUpdateSection(await getCurrentUser())) {
      return { error: true, message: "you are not authorised to update courses." }
   }

   await updateSectionDB(id, data);

   return { error: false, message: "Successfully updated the course." }

}

export async function deleteSection(id: string) {

   if (!canDeleteSection(await getCurrentUser())) {
      return { error: true, message: "Error deleting your course." }
   }
   await deleteSectionDB(id);

   return { error: false, message: "Successfully deleted your course" }
}

export async function updateSectionOrder(sectionIds : string[]) {
  if(sectionIds.length === 0 || !canUpdateSection(await getCurrentUser())) {
   return {error : true, message : "could not re-order sections."}
  }
 
  await updateSectionOrderDB(sectionIds);

  return {error : true, message : "successfully re-ordered your sections."}
}