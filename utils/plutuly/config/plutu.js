const dotenv = require("dotenv");
dotenv.config();

exports.config = {
  apiKey: process.env.PLUTU_API_KEY || "",
  accessToken: process.env.PLUTU_ACCESS_TOKEN || "",
  secretKey: process.env.PLUTU_SECRET_KEY || "",
  baseUrl: "https://api.plutus.ly/api",
  apiVersion: "v1",
};
