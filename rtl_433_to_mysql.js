const mysql = require("mysql2");
const { exec } = require("child_process");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function runRtl433() {
  // Replace this command with the appropriate rtl_433 command
  const rtl433Command = "rtl_433 -F json";

  exec(rtl433Command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing rtl_433: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Error output from rtl_433: ${stderr}`);
      return;
    }

    // Process the rtl_433 output and insert it into the MySQL database
    console.log(`rtl_433 output: ${stdout}`);
  });
}

function connectToDatabase() {
  connection.connect((error) => {
    if (error) {
      console.error(`Error connecting to MySQL: ${error}`);
      process.exit(1);
    } else {
      console.log("Connected to MySQL");
      runRtl433();
    }
  });
}

connectToDatabase();
