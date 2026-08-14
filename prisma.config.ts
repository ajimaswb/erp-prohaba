import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
    adapter: () => new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL! })),
  },
});
