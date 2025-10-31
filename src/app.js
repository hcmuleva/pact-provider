const express = require('express');
const app = express();

app.use(express.json());

// Your user data - this should match what's expected in the pact
const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" }
];

// GET /users/:id - This endpoint will be verified by Pact
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;