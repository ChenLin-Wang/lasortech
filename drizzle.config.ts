import { defineConfig } from "drizzle-kit";
export default defineConfig({
    dialect: "postgresql",
    schema: ["./src/storage/schema/*"],
    casing: "snake_case",
    dbCredentials: {
        url: "postgres://clwang:12345@localhost:5432/postgres"
    }
});