import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { varchar, text, real } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { procedures } from "./procedures.ts"
import { employees } from "./employees.ts"

export const statePayments = mysqlTable('state_payments', {
    stateId: varchar( { length: 36 } ).references(() => procedures.id, { onDelete: "cascade" }).primaryKey(),
    amount: real().notNull()
})

export const stateProcessings = mysqlTable('state_processings', {
    stateId: varchar( { length: 36 } ).references(() => procedures.id, { onDelete: "cascade" }).primaryKey(),
    employeeId: varchar( { length: 36 } ).references(() => employees.id, { onDelete: "cascade" }).notNull(),
    reason: text()
})

export const stateIncompletes = mysqlTable('state_incompletes', {
    stateId: varchar( { length: 36 } ).references(() => procedures.id, { onDelete: "cascade" }).primaryKey(),
    reason: text()
})

export const stateUserCancels = mysqlTable('state_user_cancels', {
    stateId: varchar( { length: 36 } ).references(() => procedures.id, { onDelete: "cascade" }).primaryKey(),
    reason: text()
})



export const statePaymentsRelations = relations(statePayments, ({ one }) => ({
    procedure: one(procedures, {
        fields: [statePayments.stateId],
        references: [procedures.id]
    })
}))

export const stateProcessingsRelations = relations(stateProcessings, ({ one }) => ({
    procedure: one(procedures, {
        fields: [stateProcessings.stateId],
        references: [procedures.id]
    })
}))

export const stateIncompletesRelations = relations(stateIncompletes, ({ one }) => ({
    procedure: one(procedures, {
        fields: [stateIncompletes.stateId],
        references: [procedures.id]
    })
}))

export const stateUserCancelsRelations = relations(stateUserCancels, ({ one }) => ({
    procedure: one(procedures, {
        fields: [stateUserCancels.stateId],
        references: [procedures.id]
    })
}))