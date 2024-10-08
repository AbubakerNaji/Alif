const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
  pass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pass",
    required: true,
  } ,
  percentage: { 
      type: Number,
      required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
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

module.exports = mongoose.model("Invoice", InvoiceSchema)