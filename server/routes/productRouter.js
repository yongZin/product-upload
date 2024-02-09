//상품 API
require("dotenv").config();
const { Router } = require("express");
const productRouter = Router();
const Product = require("../models/Product");
const { upload } = require("../middleware/imageUpload");
const fs = require("fs"); //file system
const { promisify } = require("util");
const mongoose = require("mongoose");

const fileUnlink = promisify(fs.unlink);

productRouter.post(
	"/", upload.fields([
		{ name: 'mainImage', maxCount: 10 },
		{ name: 'detailImage', maxCount: 10 }
	]), async (req, res) => {
	//DB 저장
	try {
		if(!req.user) throw new Error("권한이 없습니다."); //로그인 유무 확인

		const { name, price, details, type, material, color } = req.body;
		const mainImages = req.files.mainImage || [];
		const detailImages = req.files.detailImage || [];
		
		const product = await new Product({
			user: {
				_id: req.user.id,
				name: req.user.name,
				userID: req.user.userID,
			},
			key: mainImages[0].filename,
			name: name,
			price: price,
			mainImages: mainImages.map((file) => ({
				key: file.filename,
				filename: file.filename,
				originalname: file.originalname,
			})),
			detailImages: detailImages.map((file) => ({
				key: file.filename,
				filename: file.filename,
				originalname: file.originalname,
			})),
			details: details,
			type: type,
			material: material,
			color: color,
		}).save();

		res.json(product);
		
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

productRouter.get("/", async(req, res) => { //DB 불러오기
	try {
		const { lastid } = req.query;

		if(lastid && !mongoose.isValidObjectId(lastid)) throw new Error("lastid 오류");
		
		const product = await Product.find(
			lastid && { _id: { $lt: lastid } }
		).sort({ _id: -1 }).limit(6); //최신상품순, 페이지당 상품 개수

		res.json(product);
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

productRouter.delete("/:productId", async (req, res) => { //DB 삭제
	try {
		if(!req.user) throw new Error("권한이 없습니다."); //로그인 유무 확인
		if(!mongoose.isValidObjectId(req.params.productId))
			throw new Error("올바르지 않은 상품 입니다.");

		const product = await Product.findOneAndDelete({_id: req.params.productId}); //삭제한 상품 알아내기

		if(!product) return res.json({ message: "이미 삭제된 상품 입니다." });

		await fileUnlink(`./uploads/${product.key}`);

		res.json({ message: "요청하신 상품이 삭제 되었습니다." });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

productRouter.patch("/:productId/like", async (req, res) => { //좋아요 기능
	try {
		if(!req.user) throw new Error("권한이 없습니다."); //로그인 유무 확인
		if(!mongoose.isValidObjectId(req.params.productId)) throw new Error("올바르지 않은 productId 입니다.");

		const product = await Product.findByIdAndUpdate(
			{ _id: req.params.productId },
			{ $addToSet: { likes: req.user.id } }, //addToSet 중복 않되는 아이디만 저장
			{ new: true }
		);

		res.json(product);
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

productRouter.patch("/:productId/unlike", async (req, res) => { //좋아요 취소
	try {
		if(!req.user) throw new Error("권한이 없습니다."); //로그인 유무 확인
		if(!mongoose.isValidObjectId(req.params.productId)) throw new Error("올바르지 않은 productId 입니다.");

		const product = await Product.findByIdAndUpdate(
			{ _id: req.params.productId },
			{ $pull: { likes: req.user.id } }, //addToSet 중복 않되는 아이디만 저장
			{ new: true }
		);

		res.json(product);
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

module.exports = { productRouter };