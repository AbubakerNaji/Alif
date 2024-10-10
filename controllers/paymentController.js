const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { Payment, PaymentType, PaymentMethod } = require("../models/Payment");
const { User } = require("../models/User");
const Wallet = require("../models/Wallet");
const testPlutuAdfali = require("./plutu/testPlutuAdfaliController");
const {
  getWithFilter,
  deleteOne,
  updateOne,
  createOne,
  getOne,
} = require("./handlerFactory");
const {
  getWithFilterAuth,
  deleteOneAuth,
  updateOneAuth,
  createOneAuth,
} = require("./handlerFactoryLogin");

exports.setFilterWallet = catchAsync(async (req, res, next) => {
  req.body.wallet = req.user.wallet;
  let filter = req.body || {};
  req.filter = filter;
  next();
});

exports.getMyPayments = getWithFilter(Payment);

exports.DepositEdfaliVerify = catchAsync(async (req, res, next) => {
  const { amount } = req.body;

  const payment = await Payment.create({
    wallet: req.user.wallet,
    type: PaymentType.DEPOSIT,
    method: PaymentMethod.ADFALI,
    amount,
    isPaid: false,
  });
  req.body.invoiceNo = payment._id;
  next();
});

exports.DepositEdfaliConfirm = catchAsync(async (req, res, next) => {
  const { mobileNumber, amount, invoiceNo, transaction, plutu } = req.body;
  // if (!transaction) {
  //   return next(new AppError("Transaction ID not found", 404));
  // }
  console.log(invoiceNo);
  console.log(plutu);
  const payment = await Payment.findById(invoiceNo);
  if (!payment) {
    return next(new AppError("Payment not found", 404));
  }
  if (payment.isPaid) {
    return next(new AppError("Payment has already been confirmed", 400));
  }
  console.log(payment.wallet);

  const wallet = await Wallet.findById(payment.wallet );
  if (!wallet) {
    return next(new AppError("User not found", 404));
  }
  console.log(amount);


  wallet.balance += amount;
  await wallet.save();
  payment.isPaid = true;
  await payment.save();

  res.status(200).json({
    status: "success",
    message: "Payment confirmed successfully",
    data: {
      data: plutu,
      invoiceNo,
    },
  });
});
