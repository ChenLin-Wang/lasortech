import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

export const customers = pgTable('customers', {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar().notNull(),
    contactNumber: varchar().notNull(),
    email: varchar().notNull(),
    messengerId: varchar(),
    description: varchar()
})

export const items = pgTable('items', {
    id: uuid().defaultRandom().primaryKey(),
    belongedCustomerId: uuid().references(() => customers.id, { onDelete: "cascade" }).notNull(),
    brand: varchar(),
    model: varchar(),
    name: varchar(),
    description: varchar()
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