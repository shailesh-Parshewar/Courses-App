import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { CourseProductTable } from "./courseProducts";
import { UserCourseAccessTable } from "./UserCourseAccess";

export const CourseTable = pgTable("courses", {
    id,
    name: text().notNull(),
    description: text().notNull(),

    createdAt,
    updatedAt
})



export const CourseRelationships = relations(CourseProductTable, ({many}) => ({
    course : many(CourseProductTable),
    courseAccesses : many(UserCourseAccessTable)
}));