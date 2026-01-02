const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// DB path
const dbPath = path.join(__dirname, "db.json");

// Helpers
const readDB = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const writeDB = (data) =>
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

/* -- READ -- */

// Home
app.get("/", (req, res) => {
  res.send("Express CRUD API is running");
});

// Get all users
app.get("/users", (req, res) => {
  const db = readDB();
  res.json(db.users);
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

/*-- CREATE -- */

app.post("/users", (req, res) => {
  const db = readDB();

  const newUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    age: req.body.age
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json(newUser);
});

/* -- UPDATE -- */

app.put("/users/:id", (req, res) => {
  const db = readDB();
  const index = db.users.findIndex(u => u.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  db.users[index] = { ...db.users[index], ...req.body };
  writeDB(db);

  res.json(db.users[index]);
});

/* -- DELETE --*/

app.delete("/users/:id", (req, res) => {
  const db = readDB();
  const users = db.users.filter(u => u.id !== Number(req.params.id));

  if (users.length === db.users.length) {
    return res.status(404).json({ message: "User not found" });
  }

  db.users = users;
  writeDB(db);

  res.json({ message: "User deleted successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
