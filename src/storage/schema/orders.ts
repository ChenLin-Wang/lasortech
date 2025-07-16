import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { varchar, text, primaryKey } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { items } from "./items.ts"

export const orders = mysqlTable('orders', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    rmsCode: text(),
    description: text()
})

export const orderItemMap = mysqlTable('order_item_map', {
    orderId: varchar( { length: 36 } ).references(() => orders.id, { onDelete: "cascade" }).notNull(),
    itemId: varchar( { length: 36 } ).references(() => items.id, { onDelete: "cascade" }).notNull()
}, (t) => [
    primaryKey({ columns: [t.orderId, t.itemId] })
])



export const ordersRelations = relations(orders, ({ many }) => ({
    orderItemMap: many(orderItemMap)
}))

export const itemsRelations = relations(items, ({ many }) => ({
    orderItemMap: many(orderItemMap)
}))

export const orderItemMapRelations = relations(orderItemMap, ({ one }) => ({
    order: one(items, {
        fields: [orderItemMap.itemId],
        references: [items.id]
    }),
    item: one(orders, {
        fields: [orderItemMap.orderId],
        references: [orders.id]
    })
}))