import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { CourseProductTable } from "./courseProducts";
import { UserCourseAccessTable } from "./UserCourseAccess";
import { CourseSectionTable } from "./courseSection";

export const CourseTable = pgTable("courses", {
    id,
    name: text().notNull(),
    description: text().notNull(),

    createdAt,
    updatedAt
})



export const CourseRelationships = relations(CourseProductTable, ({many}) => ({
    products : many(CourseProductTable),
    sections : many(CourseSectionTable),
    courseAccesses : many(UserCourseAccessTable),
}));