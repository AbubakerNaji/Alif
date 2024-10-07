const SerivceDate = require("../../models/SerivceDate");
const {
  getWithFilter,
  deleteOne,
  updateOne,
  createOne,
  getOne,
} = require("../handlerFactory");

exports.createServiceDate = createOne(SerivceDate);

exports.getServiceDate = getWithFilter(SerivceDate);

exports.getOneServiceDate = getOne(SerivceDate);

exports.updateServiceDate = updateOne(SerivceDate);

exports.deleteServiceDate = deleteOne(SerivceDate);
