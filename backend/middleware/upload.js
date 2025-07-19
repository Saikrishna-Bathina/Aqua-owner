const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "puredrop_shops",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 600, height: 400, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = upload;
