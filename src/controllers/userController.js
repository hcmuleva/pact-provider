const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" }
];

exports.getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
