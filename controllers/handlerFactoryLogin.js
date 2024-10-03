const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Kid = require("../models/Kid");
const {User} = require("../models/User");
const Favorite = require("../models/Favorite");
const Location = require("../models/Location");

exports.updateOneAuth = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model === Kid) {
      req.body.parent = req.user._id;
    } else {
      req.body.user = req.user._id;
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true, 
    });

    if (!doc) return next(new AppError("No Entities found", 404));

    res.status(202).json({
      status: "success",
      message: "Entity was updated successfully",
      data: {
        data: doc,
      },
    });
  });

exports.createOneAuth = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model === Kid) {
      req.body.parent = req.user._id;
    } else {
      req.body.user = req.user._id;
    }

    const newModel = new Model(req.body);
    await newModel.save();

    const user = await User.findById(req.user._id);

    switch (Model) {
      case Kid:
        user.kids.push(newModel._id);
        break;
      case Location:
        user.locations.push(newModel._id);
        break;
      case Favorite:
        user.favorites.push(newModel._id);
        break;
      default:
        return next(new AppError("Unknown model type", 400)); 
    }

    await user.save(); // Save the updated user document

    res.status(201).json({
      status: "success",
      message: "Entity was saved successfully",
      data: {
        data: newModel,
      },
    });
  });

exports.getWithFilterAuth = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = req.filter || {};
    let parentOrUser = "user";

    if (Model === Kid) {
      parentOrUser = "parent";
    }

    // Dynamically add filter for user or parent
    const getModels = await Model.find({
      [parentOrUser]: req.user._id,
      ...filter,
    });

    res.status(200).json({
      status: "success",
      message: "Got the selected entities successfully",
      data: {
        data: getModels,
      },
    });
  });

  exports.deleteOneAuth = (Model) =>
    catchAsync(async (req, res, next) => {
      let parentOrUser = "user";
  
      if (Model === Kid) {
        parentOrUser = "parent";
      }
      
  
      const doc = await Model.findOneAndDelete({
        _id: req.params.id,
        [parentOrUser]: req.user._id,
      });
  
      if (!doc) return next(new AppError("No entity found or you are not authorized to delete this", 404));
  
      const user = await User.findById(req.user._id);
      switch (Model) {
        case Kid:
          user.kids = user.kids.filter(kidId => kidId.toString() !== req.params.id);
          break;
        case Location:
          user.locations = user.locations.filter(locationId => locationId.toString() !== req.params.id);
          break;
        case Favorite:
          user.favorites = user.favorites.filter(favoriteId => favoriteId.toString() !== req.params.id);
          break;
        default:
          return next(new AppError("Unknown model type", 400));
      }
      await user.save();
  
      res.status(200).json({
        status: "success",
        message: "Entity was deleted successfully",
      });
    });
  