//유저 API
const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");

userRouter.post("/register", async (req, res) => {
	console.log(req.body);

	const user = await new User(req.body).save();

	res.json({ message: "회원가입 완료" })
});

module.exports = { userRouter };