const config = require("../configs/config");
require("dotenv").config();

const s3 = config.S3;

module.exports = {
  getSignedUrlForPut: async (fileName) => {
    const params = {
      Bucket: config.AWS_BUCKET,
      Key: fileName,
      Expires: 60 * 5, // URL expires in 5 minutes
    };
    try {
      const url = await new Promise((resolve, reject) => {
        s3.getSignedUrl("putObject", params, (err, url) => {
          if (err) reject(err);
          else resolve(url);
        });
      });
      return url;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // Function to generate a signed URL for downloading a file from S3
  getSignedUrlForGet: async (fileName) => {
    const params = {
      Bucket: config.AWS_BUCKET,
      Key: fileName,
      Expires: 60 * 5 * 24, // URL expires in 24*5 minutes
    };
    try {
      const url = await new Promise((resolve, reject) => {
        s3.getSignedUrl("getObject", params, (err, url) => {
          if (err) reject(err);
          else resolve(url);
        });
      });
      return url;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  getPublicUrl: async (fileName) => {
    const params = {
      Bucket: config.AWS_BUCKET,
      Key: fileName,
    };

    try {
      const data = await s3.getObject(params).promise();
      // The data includes a `Body` field, which is the content of the object.
      // You can use this data directly or convert it to a Buffer or string.

      // Assuming the object is an image, you might want to convert it to a data URL.
      const contentType = data.ContentType;
      const content = data.Body.toString("base64");
      const dataUrl = `data:${contentType};base64,${content}`;

      return dataUrl;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
