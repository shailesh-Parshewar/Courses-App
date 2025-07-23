import { CourseSectionTable } from "@/drizzle/schema";
import { revalidateCourseSectionCache } from "./cache";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";


export async function getNextCourseSectionOrder(courseId: string) {
    // gets the number of sections for a course

    const section = await db.query.CourseSectionTable.findFirst({
        columns: { order: true },
        where: ({ courseId: courseIdCol }, { eq }) => eq(courseIdCol, courseId),
        orderBy: ({ order }, { desc }) => desc(order),
    })
    return section ? section.order + 1 : 0;
}


export async function insertSection(data: typeof CourseSectionTable.$inferInsert) {
    const [newSection] = await db
        .insert(CourseSectionTable)
        .values(data)
        .returning();

    if (!newSection) throw new Error("failed to create new section.");

    revalidateCourseSectionCache({
        id: newSection.id,
        courseId: newSection.courseId
    });

    return newSection;
}
export async function updateSection(id: string, data: Partial<typeof CourseSectionTable.$inferInsert>) {

    const [updatedSection] = await db
        .update(CourseSectionTable)
        .set(data)
        .where(eq(CourseSectionTable.id, id))
        .returning();

    if (!updatedSection) throw new Error("failed to update section.");

    revalidateCourseSectionCache({
        id: updatedSection.id,
        courseId: updatedSection.courseId
    });

    return updatedSection
}

export async function deleteSection(id: string) {
    const [deletedSection] = await db
        .delete(CourseSectionTable)
        .where(eq(CourseSectionTable.id, id))
        .returning();

    if (deletedSection == null) throw new Error("failed to delete section.")

    revalidateCourseSectionCache({
        id: deletedSection.id,
        courseId: deletedSection.courseId
    });
    return deletedSection;
}

export async function updateSectionOrder(sectionIds: string[]) {
    const sections = await Promise.all(
        sectionIds.map((id, index) =>
            db.update(CourseSectionTable)
                .set({ order: index })
                .where(eq(CourseSectionTable.id, id))
                .returning({
                    courseId: CourseSectionTable.courseId,
                    id: CourseSectionTable.id
                }))
    )
    sections.flat().forEach(({id, courseId}) => (
        revalidateCourseSectionCache({id, courseId})
    ))
}
