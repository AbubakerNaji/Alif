const mongoose = require("mongoose");


const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  //add Serivce 
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
// FavoriteSchema.pre("save", async function (next) {
//   const user = await User.findById(this.user);
//   user.favorites.push(this._id);
//   await user.save();
//   next();

// })
module.exports = mongoose.model("Favorite", FavoriteSchema);
