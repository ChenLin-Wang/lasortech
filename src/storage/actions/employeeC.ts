import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { employees } from "../schema/employees.ts";
import { Update } from "drizzle-orm";

type NewEmployee = typeof employees.$inferInsert;
type UpdateEmployeePayload = Partial<typeof employees.$inferInsert>;

export class EmployeeController {
    constructor(
        private db: NodePgDatabase
    ) {}

    create(...es: NewEmployee[]) {
        return this.db
            .insert(employees)
            .values(es)
            .returning( { id: employees.id } )
    }
}