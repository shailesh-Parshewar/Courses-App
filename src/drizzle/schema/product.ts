import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { CourseProductTable } from "./courseProducts";
import { PurchaseTable } from "./Purchase";

const productStatuses = ["public", "private"] as const;
export type productStatus = (typeof productStatuses)[number]
const productStatusEnum = pgEnum("product_status", productStatuses);

export const ProductTable = pgTable("products", {
 id,
 name: text().notNull(),
 description: text().notNull(),
 imageUrl: text().notNull(),
 price: integer().notNull(),
 status : productStatusEnum().notNull().default("private"),
 createdAt,
 updatedAt,
})

export const ProductRelationships = relations(ProductTable, ({many}) =>  ({
    product : many(CourseProductTable),
    purchases : many(PurchaseTable)
}));