//유저관련 API
const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const { hash, compare } = require("bcryptjs");
const mongoose = require("mongoose");
const Product = require("../models/Product");

userRouter.post("/register", async (req, res) => {
	try {
		if(req.body.password.length < 6) throw new Error("비밀번호를 6자 이상으로 해주세요.");
		if(req.body.username.length < 3) throw new Error("아이디를 3글자 이상으로 해주세요.");

		const hashedPassword = await hash(req.body.password, 10);

		const user = await new User({
			name: req.body.name,
			userID: req.body.username,
			hashedPassword,
			sessions: [{ createdAt: new Date() }]
		}).save();

		const session = user.sessions[0];

		res.json({
			message: "회원가입 성공",
			sessionId: session._id,
			name: user.name,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

userRouter.patch("/login", async (req, res) => {
	try {
		const user = await User.findOne({ userID: req.body.username });

		if (!user) throw new Error("입력하신 정보가 옳바르지 않습니다.");

		const isValid = await compare(req.body.password, user.hashedPassword);

		if (!isValid) throw new Error("입력하신 정보가 옳바르지 않습니다.");

		user.sessions.push({ createdAt: new Date() });

		const session = user.sessions[user.sessions.length - 1];

		await user.save();

		res.json({
			message: "로그인 성공",
			sessionId: session._id,
			name: user.name,
			userID: user._id,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

userRouter.patch("/logout", async (req, res) => {
	try {
		if (!req.user) throw new Error("로그인정보 오류");

		await User.updateOne( //로그아웃시 세션ID 삭제
			{ _id: req.user.id },
			{ $pull: { sessions: { _id: req.headers.sessionid } } } //배열 수정(세션ID 삭제)
		);

		res.json({ message: "로그아웃" });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

userRouter.get("/userInfo", (req, res) => { // 세션id를 가진 유저정보 불러오기
	try {
		if(!req.user) return;

		res.json({
			message: "성공",
			sessionId: req.headers.sessionid,
			name: req.user.name,
			userID: req.user._id,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

// userRouter.get("/userInfo/products", async (req, res) => {
// 	try {
// 		if(!req.user) return;
		
// 		const producus = await Product.find({ "user._id": req.user.id }); //특정 아이디의 이미지만 찾기
		
// 		res.json(producus);
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.message });
// 	}
// });

module.exports = { userRouter };