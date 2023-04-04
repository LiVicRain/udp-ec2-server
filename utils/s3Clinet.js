const { S3Client, ListObjectsCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3"); // v3
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function listObject(bucketName, prefix) {
  const command = new ListObjectsCommand({
    Bucket: bucketName,
    Prefix: prefix,
  });

  const result = await s3Client.send(command);
  return result.Contents;
}

async function deletObjects(bucketName, prefix) {
  const objcets = await listObject(bucketName, prefix);

  const deleteCommands = objcets.map(objcet => {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objcet.Key,
    });
    return command;
  });
  await Promise.all(deleteCommands.map(command => s3Client.send(command)));
}

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

module.exports = { s3Client, deletObjects, upload };
