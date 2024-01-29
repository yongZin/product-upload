require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Product = require("./models/Product");
const { MONGO_URI, PORT } = process.env;
const { upload } = require("./middleware/imageUpload")

mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log("MongoDB 연결");
		app.use("/uploads", express.static("uploads"));

		app.post("/upload", upload.fields([{ name: 'mainImage', maxCount: 10 }, { name: 'detailImage', maxCount: 10 }]), async (req, res) => { //DB 저장
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

		app.get("/upload", async(req, res) => {
			const product = await Product.find();

			res.json(product);
		})

		app.listen(PORT, () => console.log("Express server listenning on PORT : " + PORT))
	})
	.catch((error) => console.log(error));
	// admin
	// NqEGY6y8EuPljCn9