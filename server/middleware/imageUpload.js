//이미지 업로드 미들웨어
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const multerS3 = require("multer-s3");
const { s3 } = require("../aws");

const storage = multerS3({ //클라이언트에서 uuid를 사용한 경우
  s3,
  bucket: "yongzin",
  key: (req, file, callback) => {
    callback(null, `raw/${file.originalname}`);
  },
});

const upload = multer({
	storage,
	fileFilter: (req, file, callback) => {
		// if (["image/png", "image/jpeg"].includes(file.mimetype)) callback(null, true); //png와 jpeg만 업로드허용
		if (file.mimetype.startsWith("image/")) callback(null, true); //모든 이미지파일 업로드 허용
		else callback(new Error("file type error"), false)
	},
	limits: {
		fileSize: 1024 * 1024 * 5000, //5MB 크기 제한
	},
});

module.exports = { upload };