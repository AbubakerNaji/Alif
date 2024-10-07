const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const {
  deleteOneAuth,
  getWithFilterAuth,
  updateOneAuth,
  createOneAuth,
} = require("./handlerFactoryLogin");
const Favorite = require("../models/Favorite");
const User = require("../models/User");

exports.getMyFavorites = getWithFilterAuth(Favorite);
exports.getMyFavoritesPopulate = getWithFilterAuth(Favorite,['service']);

exports.AddFavorite = createOneAuth(Favorite);
exports.updateFavorite = updateOneAuth(Favorite);
exports.deleteFavorite = deleteOneAuth(Favorite);

