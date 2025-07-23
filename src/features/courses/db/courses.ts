import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema";
import { revalidateCourseCache } from "./cache/courses";
import { eq } from "drizzle-orm";

export async function insertCourse(data: typeof CourseTable.$inferInsert) {
    const [newCourse] = await db
        .insert(CourseTable)
        .values(data)
        .returning();

    if (!newCourse) throw new Error("failed to create new course.");

    revalidateCourseCache(newCourse.id);

    return newCourse
}
export async function updateCourse(id: string, data: typeof CourseTable.$inferInsert) {

    const [updatedCourse] = await db.update(CourseTable)
        .set(data)
        .where(eq(CourseTable.id, id))
        .returning();

    if (!updatedCourse) throw new Error("failed to update course.");

    revalidateCourseCache(updatedCourse.id);

    return updatedCourse
}

export async function deleteCourseDB(id: string) {
    const [deletedCourse] = await db
        .delete(CourseTable)
        .where(eq(CourseTable.id, id))
        .returning();

    if (deletedCourse == null) throw new Error("failed to delete course")

    revalidateCourseCache(deletedCourse.id);
    return deletedCourse;
}
