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

async function uploadFile(buffer, imgFormat, dim) {
  const fileStream = buffer;

  const fileKey = `${Date.now()}_${
    dim === 100 ? "small" : "large"
  }${imgFormat}`;
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: fileKey,
  };
  // Create an object and upload it to the Amazon S3 bucket.
  try {
    const results = await s3.send(new PutObjectCommand(uploadParams));
  } catch (err) {
    console.error(err);
  }
  // Create a presigned URL
  try {
    // Create the command.
    const command = new GetObjectCommand(uploadParams);

    // Create the presigned URL.
    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  } catch (err) {
    console.error("Error creating presigned URL", err);
  }
}

module.exports = uploadFile;
