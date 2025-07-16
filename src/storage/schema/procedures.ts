import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { smallint, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { orders } from "./orders.ts"

export const procedures = mysqlTable('procedures', {
    id: varchar({ length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: varchar( { length: 36 } ).references(() => orders.id, { onDelete: "cascade" }).notNull(),
    stateCode: smallint().notNull(),
    changedAt: timestamp({ fsp: 6 }).defaultNow().notNull()
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