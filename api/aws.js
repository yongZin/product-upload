//AWS 인증
require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
const { MY_APP_AWS_ACCESS_KEY, MY_APP_AWS_SECRET_KEY} = process.env;

const s3 = new S3Client({
	region: "ap-northeast-2",
	credentials: {
		secretAccessKey: MY_APP_AWS_SECRET_KEY,
		accessKeyId: MY_APP_AWS_ACCESS_KEY,
	}
});

const getSignedUrl = ({ key }) => {
	const params = {
		Bucket: "yongzin",
		Key: key,
		Fields: {},
		Expires: 300,
		Conditions: [
			["content-length-range", 0, 50 * 1000 * 1000], // 업로드 파일 크기 제한
			["starts-with", "$Content-Type", "image/"], // Content-Type 필드 시작 문자열 검사
		],
	};
	
	return new Promise(async (resolve, reject) => {
		await createPresignedPost(s3, params)
		.then((data) => {
			resolve(data);
		})
		.catch((err) => {
			reject(err);
		});
  });
}

module.exports = { s3, getSignedUrl };