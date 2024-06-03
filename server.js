require("dotenv").config();
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const { productRouter } = require("./routes/productRouter");
const { userRouter } = require("./routes/userRouter");
const { authentication } = require("./middleware/authentication");
const app = express();
const { MONGO_URI, MY_APP_PORT } = process.env;

mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log("MongoDB 연결");

		app.use(express.static("build")); //빌드한 경우 경로
    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/build/index.html");
    });

		// app.use("/uploads", express.static("uploads")); //로컬경로 사용시
		app.use(express.json());
		app.use(authentication); //유저인증 미들웨어
		app.use("/upload", productRouter); //"upload"가 들어가면 productRouter 실행
		app.use("/users", userRouter); // "users"가 들어가면 userRouter실행

		app.listen(MY_APP_PORT, () => console.log("PORT : " + MY_APP_PORT))
	})
	.catch((error) => console.log(error));
	// admin
	// NqEGY6y8EuPljCn9