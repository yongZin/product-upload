//유저인증 미들웨어
const mongoose = require("mongoose");
const User = require("../models/User");

const authentication = async (req, res, next) => {
	const { sessionid } = req.headers;
	
	if(!sessionid || !mongoose.isValidObjectId(sessionid)) return next(); //세션ID 조회

	const user = await User.findOne({ "sessions._id": sessionid }); //DB 조회

	if(!user) return next();

	req.user = user; //유저 정보가 존재할경우

	return next();
}

module.exports = { authentication };