"use server"

import z from "zod";
import { courseSchema } from "../schemas/courses";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/clerk";
import { canCreateCourses, canDeleteCourses, canUpdateCourses } from "../permissions/courses";
import { deleteCourseDB, insertCourse, updateCourse as updateCourseDB } from "../db/courses";

export async function createCourse(unsafeData : z.infer<typeof courseSchema>) {
 const {success, data } = courseSchema.safeParse(unsafeData);

 if(!success) {
    return {error: true, message: "there was an error creating your course."}
 }
 else if(!canCreateCourses(await getCurrentUser())) {
   return {error : true, message: "you are not authorised to create courses."}
 }
 const course = await insertCourse(data);

 redirect(`/admin/courses/${course.id}/edit`)
} 
export async function updateCourse(id : string , unsafeData : z.infer<typeof courseSchema>) {
 const {success, data } = courseSchema.safeParse(unsafeData);

 if(!success) {
    return {error: true, message: "there was an error updating your course."}
 }
 else if(!canUpdateCourses(await getCurrentUser())) {
   return {error : true, message: "you are not authorised to update courses."}
 }
await updateCourseDB(id, data);

   return {error : false, message: "Successfully updated the course."}

} 

export async function deleteCourse(id : string) {

if(!canDeleteCourses(await getCurrentUser())) {
   return {error : true, message: "Error deleting your course."}
 }
 await deleteCourseDB(id);

 return {error: false, message : "Successfully deleted your course"}
}

