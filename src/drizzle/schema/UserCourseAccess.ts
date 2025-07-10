import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { UsersTable } from "./users";
import { CourseTable } from "./course";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";



export const UserCourseAccessTable = pgTable("user_course_access", {
    userId: uuid().notNull().references(() => UsersTable.id, { onDelete: "cascade" }),
    courseId: uuid().notNull().references(() => CourseTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt
},
    t => [primaryKey({ columns: [t.userId, t.courseId] })]);

export const UserCourseAccessRelationships = relations(UserCourseAccessTable, ({one}) => ({
    course : one( CourseTable, {
        fields: [UserCourseAccessTable.courseId],
        references : [CourseTable.id]
    }),
    user : one( UsersTable,{
        fields : [UserCourseAccessTable.userId],
        references: [UsersTable.id]
    })
}))