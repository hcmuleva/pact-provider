const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");

const app = express();
app.use(bodyParser.json());
app.use("/", userRoutes);

const PORT = process.env.PORT || 8080;

if (require.main === module) {
  app.listen(PORT, () => console.log(`✅ Provider API running on port ${PORT}`));
}

module.exports = app;
