require("dotenv").config();
const fs = require("fs");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;

const s3 = new S3Client({
  region: bucketRegion,
});

/* Interacts with the S3 bucket using AWS SDK V3 for JS */
async function uploadFile(buffer, imgFormat, dim) {
  const fileStream = buffer;
  /* Assigns the current date to the file and assigns small or large based on dimension provided;
   Date name is based on the number of milliseconds between midnight, January 1, 1970 Universal Coordinated Time (UTC) (or GMT) and the specified date at the current time */
  const fileKey = `${Date.now()}_${
    dim === 100 ? "small" : "large"
  }${imgFormat}`;
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: fileKey,
  };
  /* Creates an object and uploads it to the Amazon S3 bucket */
  try {
    const results = await s3.send(new PutObjectCommand(uploadParams));
  } catch (err) {
    console.error(err);
  }
  /* Creates a presigned URL */
  try {
    const command = new GetObjectCommand(uploadParams);
    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600 /*Expires in 1hr */,
    });
    return signedUrl;
  } catch (err) {
    console.error("Error creating presigned URL", err);
  }
}

module.exports = uploadFile;
