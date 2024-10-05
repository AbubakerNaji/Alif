const jwt = require("jsonwebtoken");
const { User, Role } = require("../models/User");
const Wallet = require("../models/Wallet");
const catchAsync = require("../utils/catchAsync");
//add apperror required
const AppError = require("../utils/appError");
const fs = require("fs");
const path = require("path");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  try {
    // if (!req.file) {
    //   return next(new AppError('Please upload an image', 400));
    // }
    //if email sameemail return app error
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return next(new AppError("Email already exists", 400));
    }
    
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      image: req.file ? req.file.path : "public/avatar.png",
      role: req.body.role || Role.PARENT,
    });

    const newWallet = await Wallet.create({
      user: newUser._id,
      balance: 0,
    });

    newUser.wallet = newWallet._id;
    await newUser.save();

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    const token = signToken(newUser._id);
    res.status(201).json({
      status: "success",
      token,
      data: {
        user: userWithoutPassword,
        wallet: newWallet,
      },
    });
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Failed to delete file: ${req.file.path}`, unlinkErr);
        }
      });
    }
    return next(err);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }



  const user = await User.findOne({ email, deletedAt: null }).select("+password");
 // const user = await User.findOne({ email }).select("+password");

  //await user.populate("kids");

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      user: userWithoutPassword,
    },
  });
});
