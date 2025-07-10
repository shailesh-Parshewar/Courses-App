import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UsersTable } from "./users";
import { ProductTable } from "./product";
import { relations } from "drizzle-orm";


export const PurchaseTable = pgTable("purchase_table", {
    id,
    userId : uuid().notNull().references(() => UsersTable.id, {onDelete: "restrict"}),
    productId : uuid().notNull().references(() => ProductTable.id),
    stripeSessionId : text().notNull().unique(),

    pricePaid : integer().notNull(),
    productDetails : jsonb().notNull().$type<{name : string, description : string, imageUrl : string}>(),
    refundedAt : timestamp({withTimezone: true}),

    createdAt,
    updatedAt
});

export const PurchaseRelationships = relations(PurchaseTable, ({one}) => ({
    user : one(UsersTable, {
        fields : [PurchaseTable.userId],
        references : [UsersTable.id]
    }),
    product : one(ProductTable, {
        fields : [PurchaseTable.productId],
        references : [ProductTable.id]
    })
}))

