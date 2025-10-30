const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/api/users/:id", userController.getUserById);

module.exports = router;
