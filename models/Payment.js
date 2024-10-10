//enum WIThDRAW and DEPOSIT

const mongoose = require("mongoose");

const PaymentType = Object.freeze({
  WITHDRAW: "WITHDRAW",
  DEPOSIT: "DEPOSIT",
});

const PaymentMethod = Object.freeze({
  WALLET: "WALLET",
  ADFALI: "ADFALI",
});

const PaymentSchema = new mongoose.Schema({
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(PaymentType),
    default: PaymentType.WITHDRAW,
    required: true,
  },
  method: {
    type: String,
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.CASH,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
 
  //add paymentID
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

Object.freeze(PaymentType);
Object.freeze(PaymentMethod);


module.exports = {
  PaymentType,
  PaymentMethod,
  Payment :  mongoose.model("Payment", PaymentSchema)
};
