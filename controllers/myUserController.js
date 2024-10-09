const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { signToken } = require("../utils/middleware/protected");

const AppError = require("../utils/appError");
const { User } = require("../models/User");

exports.getUserLoggedIn = catchAsync(async (req, res, next) => {
  //populate all

  const user = await User.findById(req.user._id)
    .populate("kids")
    .populate("locations")
    .populate("favorites")
    .populate("wallet");

  // if user.immage ==  "public/avatar.png"  make it null put dont show it
  // if user.image == null make it "public/avatar.png" put dont show it

  if (!user) {
    return next(new AppError("You are not authorized", 404));
  }

  if (user.image === "public/avatar.png") {
    user.image = null;
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.deletedAt) {
    return next(new AppError("You cannot modify the deletedAt field", 400));
  }

  if (req.file) {
    req.body.image = req.file.path;
  } else if (req.files) {
    req.body.images = req.files.map((file) => file.path);
  }

  if (req.body.password) {
    return next(
      new AppError("Use a specific route to update the password", 400)
    );
  }
  req.body.updatedAt = Date.now();
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("kids")
    .populate("locations")
    .populate("favorites")
    .populate("wallet");
  if (!user) {
    return next(new AppError("You are not authorized", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("You are not authorized", 404));
  }

  // Soft delete: Set deletedAt to current date
  user.deletedAt = Date.now();
  await user.save();

  res.status(200).json({
    status: "success",
    message: "User was soft deleted successfully",
    data: {
      user,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new AppError("Please provide both current and new passwords", 400)
    );
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user || !(await user.matchPassword(currentPassword))) {
    return next(new AppError("Your current password is incorrect", 401));
  }

  user.password = newPassword;
  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});
