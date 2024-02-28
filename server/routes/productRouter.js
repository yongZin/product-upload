//상품관련 API
require("dotenv").config();
const { Router } = require("express");
const productRouter = Router();
const Product = require("../models/Product");
const { upload } = require("../middleware/imageUpload");
const fs = require("fs"); //file system
const { promisify } = require("util");
const mongoose = require("mongoose");
const { s3, getSignedUrl } = require("../aws");
const { DeleteObjectsCommand } = require("@aws-sdk/client-s3");

// const fileUnlink = promisify(fs.unlink);

productRouter.post("/presigned", async (req, res) => {
	try {
		if (!req.user) throw new Error("권한이 없습니다.");

		const { contentTypes } = req.body;

		if (!Array.isArray(contentTypes)) throw new Error("contentTypes 오류");

		const presignedData = await Promise.all(
			contentTypes.map(async (contentType) => {

        const imageKey = `${contentType.fileName}`;
        const key = `raw/${imageKey}`;
        const presigned = await getSignedUrl({ key });

        return { imageKey, presigned };
      })
		);

		res.json(presignedData);
		
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

// productRouter.post(
// 	"/", upload.fields([
// 		{ name: 'mainImage', maxCount: 10 },
// 		{ name: 'detailImage', maxCount: 10 }
// 	]), async (req, res) => {
// 	//DB 저장
// 	try {
// 		if(!req.user) throw new Error("권한이 없습니다."); //로그인 유무 확인
		
// 		const { name, price, mainImages, detailImages, details, type, material, color } = req.body;
// 		// const mainImages = req.files.mainImage || [];
// 		// const detailImages = req.files.detailImage || [];
		
// 		const product = await new Product({
// 			user: {
// 				_id: req.user.id,
// 				name: req.user.name,
// 				userID: req.user.userID,
// 			},
// 			key: mainImages[0].imageKey,
// 			name: name,
// 			price: price,
// 			mainImages: await Promise.all(
// 				mainImages.map((file) => ({
// 					key: file.imageKey,
// 					filename: file.imageKey,
// 					originalname: file.imageKey,
// 				})),
// 			),
// 			detailImages: await Promise.all(
// 				detailImages.map((file) => ({
// 					key: file.imageKey,
// 					filename: file.imageKey,
// 					originalname: file.imageKey,
// 				})),
// 			),
// 			details: details,
// 			type: type,
// 			material: material,
// 			color: color,
// 		}).save();

// 		res.json(product);
		
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ message: error.message });
// 	}
// });


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
			key: mainImages[0].originalname,
			name: name,
			price: price,
			mainImages: mainImages.map((file) => ({
				key: file.originalname,
				filename: file.originalname,
				originalname: file.originalname,
			})),
			detailImages: detailImages.map((file) => ({
				key: file.originalname,
				filename: file.originalname,
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

productRouter.get("/", async(req, res) => { //DB(상품리스트) 불러오기
	try {
		const { lastid, sort, color, type } = req.query;

		if(lastid && !mongoose.isValidObjectId(lastid)) throw new Error("lastid 오류");

		let query = lastid ? { _id: { $lt: lastid } } : {};
		let sortOption = {};
		let filterCountQuery;

		if (color) {
			query.color = color;
			filterCountQuery = Product.countDocuments({ color });
			if (type) {
				filterCountQuery = Product.countDocuments({ color, type });
			}
		}
		if (type) {
			query.type = type;
			filterCountQuery = Product.countDocuments({ type });
			if (color) {
				filterCountQuery = Product.countDocuments({ color, type });
			}
		}

		switch (sort) {
      case "new":
        sortOption = { _id: -1 }; // 최신 상품순
        break;
      case "likes":
        sortOption = { likes: -1 }; // 인기순
        break;
      case "highPrice":
        sortOption = { price: -1 }; // 높은 가격순
        break;
      case "lowPrice":
        sortOption = { price: 1 }; // 낮은 가격순
        break;
      default:
        sortOption = { _id: -1 }; // 기본은 최신 상품순
    }

		const productsQuery = Product.find(query).sort(sortOption).limit(6);
		const totalProductCountQuery = Product.countDocuments({});

		const [products, totalProductCount, filterCount] = await Promise.all([
			productsQuery,
			totalProductCountQuery,
			filterCountQuery
		]);

		const productCount = color || type ? filterCount : totalProductCount;

		res.json({ products, productCount });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

productRouter.get("/all", async (req, res) => { //DB(모든정보) 불러오기
  try {
    const products = await Product.find();
		
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

productRouter.delete("/:productId", async (req, res) => { //DB 삭제
	try {
		if(!req.user) throw new Error("권한이 없습니다."); //로그인 유무 확인
		if(!mongoose.isValidObjectId(req.params.productId))
			throw new Error("올바르지 않은 상품 입니다.");

		const product = await Product.findOneAndDelete({_id: req.params.productId}); //삭제한 상품 알아내기

		if(!product) return res.json({ message: "이미 삭제된 상품 입니다." });

		if (product.mainImages || product.detailImages) { //s3.raw 버킷에서 이미지 삭제하기 
			const mainImages = product.mainImages ? product.mainImages.map((image) => ({
				Key: `raw/${image.key}`,
			})) : [];

			const detailImages = product.detailImages ? product.detailImages.map((image) => ({
				Key: `raw/${image.key}`,
			})) : [];

			const command = new DeleteObjectsCommand({
				Bucket: "yongzin",
				Delete: {
					Objects: [...mainImages, ...detailImages]
				},
			});

			try {
				const { Deleted } = await s3.send(command);
			
			} catch (error) {
				console.error(error);
			}
		}

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