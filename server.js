const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Route to handle form submission
app.post("/register", (req, res) => {
  const { name, address } = req.body;

  db.run("INSERT INTO User (name) VALUES (?)", [name], function (err) {
    const userId = this.lastID;
    db.run(
      "INSERT INTO Address (userId, address) VALUES (?, ?)",
      [userId, address],
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to insert address" });
        }
        res.status(200).json({ message: "Data submitted successfully" });
      }
    );
  });
});

// Route to get all users with their addresses
app.get("/users", (req, res) => {
  const query = `
        SELECT User.id, User.name, Address.address
        FROM User
        INNER JOIN Address ON User.id = Address.userId
    `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Failed to retrieve users" });
    }
    res.status(200).json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
