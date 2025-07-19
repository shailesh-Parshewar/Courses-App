import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { CourseTable } from "./course";
import { CourseSectionTable } from "./courseSection";
import { relations } from "drizzle-orm";
import { UserLessonCompleteTable } from "./userLessonComplete";





export const LessonStatuses = ["public", "private", "preview"] as const;
export type LessonStatus = (typeof LessonStatuses)[number]
export const LessonStatusEnum = pgEnum("course_lesson_status", LessonStatuses);


export const CourseLessonTable = pgTable("course_lessons", {
    id,
    name: text().notNull(),
    description: text(),
    youtubeVideoId: text().notNull(),

    order: integer().notNull(),
    status: LessonStatusEnum().notNull().default("private"),
    sectionId: uuid().notNull().references(() => CourseSectionTable.id, { onDelete: "cascade" }),

    createdAt,
    updatedAt
});

export const LessonRelationships = relations(
    CourseLessonTable,
    ({ one, many }) => ({
        sections : one(CourseSectionTable, {
            fields: [CourseLessonTable.sectionId],
            references: [CourseSectionTable.id]
        }),
        lessonsCompleted: many(UserLessonCompleteTable)
    })
)