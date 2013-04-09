module.exports = {
	mongo: process.env.MONGODB_URL,
	port: process.env.PORT || 5666,
	s3: {
		key: process.env.S3_KEY,
		secret: process.env.S3_SECRET,
		bucket: "pin-clone"
	}
};