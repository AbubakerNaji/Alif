const mongoose = require("mongoose");
const KidSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    // male 0 female 1
    type: Boolean,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

module.exports = mongoose.model("Kid", KidSchema);
