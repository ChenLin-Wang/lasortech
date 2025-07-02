import { Pool } from "npm:pg"
import { drizzle } from 'drizzle-orm/node-postgres'

export class Storage {

    constructor(
        private pool = new Pool(
            { connectionString: "postgres://clwang:12345@localhost:5432/postgres" }
        ),
        private db = drizzle(pool)
    ) {}
    
    async do() {
        const res = await this.db.execute("select 1")
        console.log(res.rows)
    }

    close() {
        this.pool.end()
    }
}