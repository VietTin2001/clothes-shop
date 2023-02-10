const dotenv = require("dotenv");
const cloudinaryModule = require("cloudinary");

dotenv.config();
const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: "dry5epwkb",
  api_key: "337419175582266",
  api_secret: "2A_pUCca7mZ9no2pKe_gPqjzCGY",
});

module.exports = cloudinary;