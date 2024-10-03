const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Location = require("../models/Location");
const {
  deleteOneAuth,
  getWithFilterAuth,
  updateOneAuth,
  createOneAuth,
} = require("./handlerFactoryLogin");

exports.getMyLocations = getWithFilterAuth(Location);
exports.AddLocation = createOneAuth(Location);
exports.updateLocation = updateOneAuth(Location);
exports.deleteLocation = deleteOneAuth(Location);
