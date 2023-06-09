const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();

// Create a new Express app
const app = express();
const HOST = "0.0.0.0";
const PORT = process.env.PORT || 80;

// Use body-parser middleware to parse JSON request body
app.use(bodyParser.json());
app.use(cors());

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

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log("got login request: ", email, password);

  if (email === "admin" && password === "admin") {
    const user = {
      email: email,
      name: "Admin",
      role: "admin",
    };
    // Create a token for the user.
    // Replace 'your-secret-key' with your own secret key
    const token = jwt.sign(
      user,
      process.env.JWT_TOKEN || "somesupersecretkeyformyjwttokensQ!@!@",
      { expiresIn: "1h" }
    );

    // Send the token back to the client
    res.json({ token });
  } else {
    res.status(401).send({ error: "Invalid email or password" });
  }
});

app.get("/data", (req, res) => {
  const query = "SELECT * FROM rtl_data";

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "An error occurred while fetching data." });
    } else {
      res.json(rows);
    }
  });
});

app.get("/data/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM rtl_data WHERE id = ?";

  db.get(query, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: "An error occurred while fetching data." });
    } else if (!row) {
      res.status(404).json({ error: "Data not found." });
    } else {
      res.json(row);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello world\n");
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT}`);
});
