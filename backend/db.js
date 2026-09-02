import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,  
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

try {
  console.log("Connecting to PostgreSQL...");

  // Connection test
  const connection = await pool.query("SELECT NOW()");
  console.log("PostgreSQL connected successfully!");
  console.log(connection.rows);


  const updateAccount = await pool.query("UPDATE accounts SET amount = $1 WHERE name = $2 RETURNING *", [2000, "Ali"]);
  console.log("Updated account:", updateAccount.rows[0]);

} catch (error) {
  console.log("Query failed:", error.message);

} finally {
  console.log("Closing PostgreSQL connection...");

  await pool.end();

  console.log("PostgreSQL connection closed gracefully.");
}







