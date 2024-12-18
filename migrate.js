import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";

const main = async () => {
  // Parse the command line arguments
  const args = new Map();
  let key = null;
  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith("--")) {
      key = arg.replace("--", "");
    } else if (key !== null) {
      args.set(key, arg);
      key = null;
    }
  }, new Map());

  // Get the specified environment file
  let envFile = ".env";
  if (args.has("env")) {
    envFile += "." + args.get("env");
  }

  // Load the .env file
  dotenv.config({ path: envFile });

  // Connect to the database
  const DB = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Create the migration table if it doesn't exist
  try {
    await DB.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT NOT NULL,
        name VARCHAR(45) NOT NULL,
        PRIMARY KEY (id)
      );
    `);
  } catch (error) {
    console.error("Failed to create database", error);
    return;
  }

  // Get the last ran migration ID
  let lastRanMigrationID = 0;
  try {
    const [rows] = await DB.query(`
      SELECT id, name
      FROM migrations
      ORDER BY id DESC
      LIMIT 1;
    `);
    if (rows.length > 0) lastRanMigrationID = rows[0].id;
  } catch (error) {
    console.error("Failed to get last migration", error);
    return;
  }

  // Get the migration files
  const migrationFiles = fs.readdirSync("./migrations");
  if (migrationFiles.length === 0) {
    console.error("No migration files found");
    return;
  }

  // Parse the migration files into an array of objects, getting max ID simultaneously
  let maxID = 0;
  const migrations = migrationFiles
    .map((file) => {
      const match = /(\d{4})_([^\.]+)\.([^\.]+)\.sql/g.exec(file);
      if (match.length !== 4) return null;

      const id = parseInt(match[1]);
      if (id > maxID) maxID = id;

      return {
        file,
        id,
        name: match[2],
        direction: match[3],
      };
    })
    .filter((migration) => migration !== null);

  // Get the target migration ID, defaulting to the last migration
  const targetMigrationID = args.has("migrationID")
    ? parseInt(args.get("migrationID"))
    : migrations[migrations.length - 1].id;

  if (lastRanMigrationID === targetMigrationID) {
    console.log("Database is already up to date");
    return;
  }

  // Determine migration direction
  const targetDirection =
    targetMigrationID > lastRanMigrationID ? "up" : "down";

  // Filter the migrations based on the target direction
  const filteredMigrations = migrations.filter((migration) => {
    if (migration.direction !== targetDirection) return false;

    if (targetDirection === "up") {
      return (
        migration.id > lastRanMigrationID && migration.id <= targetMigrationID
      );
    }

    if (targetDirection === "down") {
      return (
        migration.id <= lastRanMigrationID && migration.id > targetMigrationID
      );
    }
  });

  // Get the migration files in the correct order
  // Up migrations should be sorted by ID ascending
  // Down migrations should be sorted by ID descending
  const sortedMigrations = filteredMigrations.sort((a, b) => {
    if (targetDirection === "up") return a.id - b.id;
    if (targetDirection === "down") return b.id - a.id;
  });

  // Only execute if confirm flag is set
  const isConfirmed = args.has("confirm");
  if (!isConfirmed) {
    console.log("DRY RUN: Use --confirm to execute the migrations");
  }

  for (const migration of sortedMigrations) {
    console.log("Running migration:", migration.file);
    if (!isConfirmed) continue;

    const sql = fs.readFileSync(`./migrations/${migration.file}`, "utf-8");
    try {
      // Execute the migration, splitting by semicolon
      const statements = sql.split(";");
      for (const statement of statements) {
        if (statement.trim() === "") continue;
        await DB.execute(statement);
      }

      // Update the migrations table based on the direction
      if (targetDirection === "up") {
        await DB.query("INSERT INTO migrations (id, name) VALUES (?, ?)", [
          migration.id,
          migration.name,
        ]);
      }
      if (targetDirection === "down") {
        await DB.query("DELETE FROM migrations WHERE id = ?", [migration.id]);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }
};

await main();
process.exit(0);
