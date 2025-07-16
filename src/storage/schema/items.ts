import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { varchar, text } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";

export const customers = mysqlTable('customers', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text().notNull(),
    contactNumber: text().notNull(),
    email: text().notNull(),
    messengerId: text(),
    description: text()
})

export const items = mysqlTable('items', {
    id: varchar({ length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    belongedCustomerId: varchar( { length: 36 } ).references(() => customers.id, { onDelete: "cascade" }).notNull(),
    brand: text(),
    model: text(),
    name: text(),
    description: text()
})



export const customersRelations = relations(customers, ({ many }) => ({
    items: many(items)
}))

export const itemsRelations = relations(items, ({ one }) => ({
    customer: one(customers, {
        fields: [items.belongedCustomerId],
        references: [customers.id]
    })
}))