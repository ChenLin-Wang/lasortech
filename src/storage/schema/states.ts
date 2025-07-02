import { real, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { procedures } from "./procedures.ts"
import { employees } from "./employees.ts"

export const statePayments = pgTable('state_payments', {
    stateId: uuid().references(() => procedures.id, { onDelete: "cascade" }).primaryKey(),
    amount: real().notNull()
})

export const stateProcessings = pgTable('state_processings', {
    stateId: uuid().references(() => procedures.id, { onDelete: "cascade" }).primaryKey(),
    employeeId: uuid().references(() => employees.id, { onDelete: "cascade" }).notNull(),
    reason: varchar()
})

export const stateIncompletes = pgTable('state_incompletes', {
    stateId: uuid().references(() => procedures.id, { onDelete: "cascade" }).primaryKey(),
    reason: varchar()
})

export const stateUserCancels = pgTable('state_user_cancels', {
    stateId: uuid().references(() => procedures.id, { onDelete: "cascade" }).primaryKey(),
    reason: varchar()
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