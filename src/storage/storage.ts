#! /usr/bin/env -S deno test -A

import { Pool } from "npm:pg"
import { drizzle } from 'drizzle-orm/node-postgres'

class Storage {
    constructor(
        private pool = new Pool(
            { connectionString: "postgres://clwang:12345@localhost:5432/postgres" }
        ),
        private db = drizzle(pool)
    ) {}

    async addEmployee(e: {
        name: string,
        contactNumber: string,
        email: string
    }) {
        return await this.db.execute("select 1")
    }

    close() {
        this.pool.end()
    }
}

export const storage = new Storage()


Deno.test('Sample creation', async () => {
    const res = await storage.addEmployee({
        name: "ajsdf;lajdsf",
        contactNumber: "12341234",
        email: "sdfa@asf.sda"
    })

    console.log(res.rows)

    storage.close()
})