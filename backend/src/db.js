// Import the dotenv package to load environment variables from a .env file
import "dotenv/config";
// Import the Pool class from the pg module to manage PostgreSQL connections
import { Pool } from "pg";

// Create a new PostgreSQL connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,  
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Export the pool instance for use in other parts of the application
export default pool;

