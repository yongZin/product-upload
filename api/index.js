require("dotenv").config();
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const { productRouter } = require("./routes/productRouter");
const { userRouter } = require("./routes/userRouter");
const { authentication } = require("./middleware/authentication");

const app = express();
const { MONGO_URI, MY_APP_PORT } = process.env;

mongoose.connect(MONGO_URI);

app.use(express.json());
app.use(authentication);
app.use("/api/upload", productRouter);
app.use("/api/users", userRouter);

app.listen(MY_APP_PORT, () => {
  console.log(`Server port ${MY_APP_PORT}`);
});

module.exports = app;