import { pgTable, uuid, varchar, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { items } from "./items.ts"

export const orders = pgTable('orders', {
    id: uuid().defaultRandom().primaryKey(),
    rmsCode: varchar(),
    description: varchar()
})

export const orderItemMap = pgTable('order_item_map', {
    orderId: uuid().references(() => orders.id, { onDelete: "cascade" }).notNull(),
    itemId: uuid().references(() => items.id, { onDelete: "cascade" }).notNull()
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