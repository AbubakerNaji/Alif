const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/User");
const {
  deleteOneAuth,
  getWithFilterAuth,
  updateOneAuth,
  createOneAuth,
} = require("./handlerFactoryLogin");
const Kid = require("../models/Kid");

exports.getMyKids = getWithFilterAuth(Kid);
exports.Addkid = createOneAuth(Kid);
exports.updatekid = updateOneAuth(Kid);
exports.deletekid = deleteOneAuth(Kid);
