#! /usr/bin/env -S deno test -A

import { drizzle } from 'drizzle-orm/mysql2'
// import { employees } from "./schema/employees.ts";
import mysql from "mysql2/promise";

class Storage {
    constructor(
        private pool = mysql.createPool({
            host: "localhost",
            user: "mysql"
        }),
        private db = drizzle(pool, { casing: 'snake_case' })
    ) {}

    // async addEmployee(e: typeof employees.$inferInsert) {
    //     return await this.db.insert(employees).values(e).returning().execute()
    // }

    close() {
        this.pool.end()
    }
}

export const storage = new Storage()


Deno.test('Sample creation', async () => {
    // const res = await storage.addEmployee({
    //     name: "ajsdf;lajdsf",
    //     contactNumber: "12341234",
    //     email: "sdfa@asf.sda"
    // })

    // console.log(res)

    // storage.close()
})