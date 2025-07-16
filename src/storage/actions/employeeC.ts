
import { MySql2Database } from "drizzle-orm/mysql2/driver";
import { employees } from "../schema/employees.ts";

type NewEmployee = typeof employees.$inferInsert;
type UpdateEmployeePayload = Partial<typeof employees.$inferInsert>;

export class EmployeeController {
    constructor(
        private db: MySql2Database
    ) {}

    create(...es: NewEmployee[]) {
        return this.db
            .insert(employees)
            .values(es)
    }
}