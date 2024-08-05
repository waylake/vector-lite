import sqlite3 from "sqlite3";

export function openDatabase(dbPath: string): sqlite3.Database {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Could not open database", err);
    }
  });
}
