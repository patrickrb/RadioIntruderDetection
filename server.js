const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

// Create a new Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Use body-parser middleware to parse JSON request body
app.use(bodyParser.json());

// Create and connect to the database
const db = new sqlite3.Database("raddb.sql", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("Connected to the in-memory SQLite database");
});

// Create the table to store rtl_433 data
db.run(`CREATE TABLE rtl_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// POST endpoint to receive rtl_433 data
app.post("/data", (req, res) => {
  const data = JSON.stringify(req.body);
  console.log("got data: ", data);

  db.run("INSERT INTO rtl_data (data) VALUES (?)", [data], (err) => {
    if (err) {
      console.error("Error inserting data into the database:", err);
      res.status(500).send({ error: "Error inserting data into the database" });
      return;
    }

    console.log("Data inserted into the database");
    res.status(201).send({ message: "Data inserted into the database" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
