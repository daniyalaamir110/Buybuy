const crypto = require("crypto");
const path = require("path");
const multer = require("multer");

const uploadImage = filename => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public");
      },
      filename: (req, file, cb) => {
        if (!filename) filename = crypto.randomBytes(64).toString("hex") + path.extname(file.originalname);
        cb(null, filename);
      }
    })
  }).single("file");
}

module.exports = uploadImage;
