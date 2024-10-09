const { User } = require("../../models/User");
const AppError = require("../appError");
const catchAsync = require("../catchAsync");
const jwt = require("jsonwebtoken");

const protected = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  await userCheck(currentUser._id,next);

  req.user = currentUser;
  next();
});

async function userCheck(id,next) {
  const userCheck = await User.findOne({
    _id: id,
    deletedAt: null,
  });
  if (!userCheck) {
    return next(
      new AppError("You are not authorized or the user is deleted", 404)
    );
  }
}

const isAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }
  next();
});
module.exports = { protected , isAdmin};
