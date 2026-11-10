import pool from "../db.js";

async function cleanupExpiredAccounts() {
let client = null;

try{ 
const client = await pool.connect();
await client.query("BEGIN")
const result = await client.query( 
`SELECT id FROM  users WHERE deletion_expires_at <= NOW()`
);

for (const user of result.rows) {
  const tasks = await client.query(
    `DELETE FROM tasks WHERE user_id = $1`,[user.id]
  )
  const deleteuser = await  client.query(
        `DELETE FROM users WHERE id = $1`,[user.id]
    )
}
await client.query("COMMIT");
}catch(error){
await client.query("ROLLBACK");
console.error("Account cleanup failed:", error);
}

finally {
  if (client) {
    client.release();
  }
}
}

export default cleanupExpiredAccounts;

