//상품 API
require("dotenv").config();
const { Router } = require("express");
const productRouter = Router();
const Product = require("../models/Product");
const { upload } = require("../middleware/imageUpload");
const mongoose = require("mongoose");

productRouter.post(
	"/",
	upload.fields([
		{ name: 'mainImage', maxCount: 10 },
		{ name: 'detailImage', maxCount: 10 }
	]), async (req, res) => { //DB 저장
	const { name, price, details, type, material, color } = req.body;
	const mainImages = req.files.mainImage;
	const detailImages = req.files.detailImage;
	
	const product = await new Product({
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
});

productRouter.get("/", async(req, res) => { //DB 불러오기
	const product = await Product.find();

	res.json(product);
});

module.exports = { productRouter };