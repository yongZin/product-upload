const mongoose = require("mongoose");

const UserSchma = new mongoose.Schema(
	{
		name: { type: String, required: true },
		username: { type: String, required: true, unique: true }, //아이디 중복방지
		password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchma);