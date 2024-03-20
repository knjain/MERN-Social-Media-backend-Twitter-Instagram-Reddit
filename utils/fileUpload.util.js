const configs = require("../configs/config");
const s3 = configs.S3;
const path = require("path");
const fs = require("fs");
const { error } = require("console");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("./apiError.util");

module.exports = {
  handleFileUpload: async (req, folderPath = configs.PROFILE_PHOTOS_PATH) => {
    const file = req.file;

    if (!file) {
      throw new ApiError(400, "No file provided");
    }

    try {
      // Extracting extension from the original file name
      var extension = path.extname(file.originalname);
      var nameWithoutExtension = path.basename(file.originalname, extension);
      // Generate a random ID
      var id = uuidv4();

      // Create a dynamic file path based on the type (videos, audios, or thumbnails)
      var newFilename =
        id +
        "-" +
        nameWithoutExtension +
        "-" +
        new Date().getTime() +
        extension;
      const fileName = `${folderPath}/${newFilename}`;
      const fileData = fs.readFileSync(file.path);
      //console.log(fileName);

      await s3
        .upload({
          Bucket: configs.AWS_BUCKET,
          Key: fileName,
          Body: fileData, // Use the compressed buffer
          ACL: "private",
        })
        .promise();

      fs.unlinkSync(file.path);
      // Download the image from the S3 bucket
      const url = `https://tambez.s3.amazonaws.com/${fileName}`;

      return url;
    } catch (err) {
      console.error(err);
      throw new ApiError(500, "Error uploading file to S3");
    }
  },
};
