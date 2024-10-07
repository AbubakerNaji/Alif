const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const Role = Object.freeze({
  ADMIN: "ADMIN",
  PARENT: "PARENT",
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "public/avatar.png",
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.PARENT,
    required: true,
  },
  kids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kid",
      required: false,
    },
  ],
  locations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: false,
    },
  ],
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: false,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Favorite",
      required: false,
    },
  ],
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};



Object.freeze(Role);
module.exports = {
  User: mongoose.model("User", userSchema),
  Role,
};
