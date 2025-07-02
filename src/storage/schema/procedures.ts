import { pgTable, smallint, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { orders } from "./orders.ts"

export const procedures = pgTable('procedures', {
    id: uuid().defaultRandom().primaryKey().notNull(),
    orderId: uuid().references(() => orders.id, { onDelete: "cascade" }).notNull(),
    stateCode: smallint().notNull(),
    changedAt: timestamp({ precision: 6, withTimezone: true }).defaultNow().notNull()
})



export const proceduresRelations = relations(procedures, ({ one }) => ({
    order: one(orders, {
        fields: [procedures.orderId],
        references: [orders.id]
    })
}))

export const ordersRelations = relations(orders, ({ many }) => ({
    orderStates: many(procedures)
}))