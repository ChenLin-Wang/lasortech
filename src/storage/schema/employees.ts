import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const employees = pgTable('employees', {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar().notNull(),
    contactNumber: varchar().notNull(),
    email: varchar().notNull(),
    messengerId: varchar(),
    avatar: varchar(),
    description: varchar()
})