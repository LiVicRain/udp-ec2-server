const express = require("express");
const authRouter = require("./routes/auth");
require("dotenv").config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const app = express();

app.use(express.json());

app.use(authRouter);

app.listen(PORT, HOST, () => {
  console.log("Server is running on port", PORT);
});
