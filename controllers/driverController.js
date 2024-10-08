const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Driver = require("../models/driver");
const {
  getWithFilter,
  deleteOne,
  updateOne,
  createOne,
  getOne,
} = require("./handlerFactory");

exports.getDrivers = getWithFilter(Driver);

exports.getWithDatesDrivers = getWithFilter(Driver, ["passes"]);

exports.updateDriver = updateOne(Driver);

exports.deleteDriver = deleteOne(Driver, ["passes"]);

exports.createDriver = createOne(Driver);


