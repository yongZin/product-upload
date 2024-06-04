//회원정보 DB 모델
const mongoose = require("mongoose");

const UserSchma = new mongoose.Schema(
	{
		name: { type: String, required: true },
		userID: { type: String, required: true, unique: true }, //아이디 중복방지
		hashedPassword: { type: String, required: true },
		sessions: [{
			createdAt: { type: Date, required: true  }
		}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchma);