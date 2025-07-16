import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { varchar, timestamp } from "drizzle-orm/mysql-core";
import { employees } from "./employees.ts";

export const session = mysqlTable('sessions', {
    session: varchar( { length: 64 } ).primaryKey().$defaultFn(() => crypto.randomUUID()),
    employeeId: varchar( { length: 36 } ).references(() => employees.id, { onDelete: "cascade" }).notNull(),
    date: timestamp({ fsp: 6 }).defaultNow().notNull()
})