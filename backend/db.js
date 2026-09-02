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

  // SELECT student
  const result = await pool.query(
    "SELECT * FROM students WHERE id = $1",
    [4]
  );

  // INSERT student
  const data = await pool.query(
    "INSERT INTO students (name) VALUES ($1) RETURNING *",
    ["Ali"]
  );
  
  // READ tasks
  const read = await pool.query("SELECT * FROM tasks");
 
  // INSERT task
  
  const insert = await pool.query(
    "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
    ["aliraza", "this my name"]
  );
  console.log(insert.rows[0]);

  //const account = await pool.query("CREATE TABLE accounts(id SERIAL PRIMARY KEY, name TEXT NOT NULL, amount NUMERIC NOT NULL)");
  //console.log("Table created successfully!");

  const insertAccount = await pool.query("INSERT INTO accounts (name, amount) VALUES ($1, $2), ($3, $4) RETURNING *", ["Ali", 1000, "Ahmed", 2000]);
  console.log("Inserted accounts:", insertAccount.rows);
  
  // UPDATE task`
  const update = await pool.query(
    "UPDATE tasks SET title = $1, description =$2 WHERE id = $3 RETURNING *", [ "MIRBAHAR", "THIS IS MY CAST", taskid]
  );

  console.log(update.rows[0]);
  const deletetask = await pool.query("DELETE FROM   tasks WHERE id = $1 RETURNING *", [taskid]);
  console.log(deletetask.rows[0]);

} catch (error) {
  console.log("Query failed:", error.message);

} finally {
  console.log("Closing PostgreSQL connection...");

  await pool.end();

  console.log("PostgreSQL connection closed gracefully.");
}







