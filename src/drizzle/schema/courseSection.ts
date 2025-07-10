import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { CourseTable } from "./course";
import { relations } from "drizzle-orm";
import { CourseLessonTable } from "./lessons";


export const SectionStatuses = ["public", "private"] as const;
export type SectionStatus = (typeof SectionStatuses)[number]
export const SectionStatusEnum = pgEnum("course_section_status", SectionStatuses);

export const CourseSectionTable = pgTable("course_sections", {
    id,
    name: text().notNull(),

    status: SectionStatusEnum().notNull().default("private"),
    orderId: integer().notNull(),
    courseId: uuid().notNull().references(() => CourseTable.id, { onDelete: "cascade" }),

    createdAt,
    updatedAt
});

export const CourseSectionRelationships = relations(
    CourseSectionTable,
    ({ one, many }) => ({
        course: one(CourseTable, {
            fields: [CourseSectionTable.courseId],
            references: [CourseTable.id]
        }),
        lessons: many(CourseLessonTable)
    }))