import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { UserCourseAccessTable } from "./UserCourseAccess";
import { PurchaseTable } from "./Purchase";
import { UserLessonCompleteTable } from "./userLessonComplete";



export const userRoles = ["user", "admin"] as const;
export type userRole = (typeof userRoles)[number]
export const userRoleEnum = pgEnum("user_role", userRoles);


export const UsersTable = pgTable("users", {
    id,
    clerkUserId : text().notNull().unique(),

    name: text().notNull(),
    email: text().notNull(),

    role: userRoleEnum().notNull().default("user"),
    imageUrl: text(),

    deletedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt
});

export const UserRelationships = relations(
    UsersTable,
     ({many}) => ({
    courseAccesses : many(UserCourseAccessTable),
    purchases : many(PurchaseTable),
    lessonsCompleted : many(UserLessonCompleteTable)
}))