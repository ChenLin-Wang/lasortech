import { defineConfig } from "drizzle-kit";
export default defineConfig({
    dialect: "mysql",
    schema: ["./src/storage/schema/*"],
    casing: "snake_case",
    dbCredentials: {
        url: "mysql://root@localhost:3306/mysql"
    }
});