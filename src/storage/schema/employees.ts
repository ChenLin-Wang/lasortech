import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { varchar, text, boolean } from "drizzle-orm/mysql-core";

export const employees = mysqlTable('employees', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text().notNull(),
    contactNumber: text().notNull(),
    email: text().notNull(),
    messengerId: text(),
    avatar: text(),
    description: text(),
    working: boolean().notNull().default(true)
})