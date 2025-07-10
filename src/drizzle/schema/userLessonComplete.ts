import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { UsersTable } from "./users";
import { CourseLessonTable } from "./lessons";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";


export const UserLessonCompleteTable = pgTable("user_lesson_complete_table", {
    userId: uuid().notNull().references(() => UsersTable.id, {onDelete : "cascade"}),
    lessonId : uuid().notNull().references(() => CourseLessonTable.id , {onDelete : "cascade"}),
    createdAt,
    updatedAt
}, t => [primaryKey({columns : [t.userId, t.lessonId]})]);

export const userLessonCompleteRelationships = relations(
    UserLessonCompleteTable, 
    ({one}) => ({
    user : one(UsersTable, {
        fields : [UserLessonCompleteTable.userId],
        references : [UsersTable.id]
    }),
    lessons : one(CourseLessonTable, {
        fields : [UserLessonCompleteTable.lessonId],
        references : [CourseLessonTable.id]
    })
}))