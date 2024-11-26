import mysql from "mysql2/promise";

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Export the Lambda handler
export const handler = async (event) => {
  try {
    const [rows] = await pool.query("SELECT * FROM test");
    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: { error: "Database error", details: err.message },
    };
  }
};
