// import { config } from "dotenv";
// import { drizzle } from "drizzle-orm/neon-http";

// config({ path: ".env" }); // or .env.local

// export const db = drizzle(process.env.DATABASE_URL!);

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);
