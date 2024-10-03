const { Model } = require("mongoose");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError("No Entitie found", 404));
    res.status(200).json({
      status: "success",
      message: "Entitie was Deleted Successfully",
    });
  });

  

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body);
    if (!doc) return next(new AppError("No Entitie found", 404));
    res.status(202).json({
      status: "success",
      message: "Entitie was Updated Successfully",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newModel = new Model(req.body);
    await newModel.save();
    res.status(201).json({
      status: "success",
      message: "Entitie was Saved Successfully",
      data: {
        data: newModel,
      },
    });
  });
  //create onewith auth


exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const getModel = await Model.find();
    res.status(200).json({
      status: "success",
      message: `Got all ${getModel.length} Entities Successfully`,
      data: {
        data: getModel,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const getModel = await Model.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Got the Selected Entitie Successfully",
      data: {
        data: getModel,
      },
    });
  });

exports.getWithFilter = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = req.filter || {};


    const getModels = await Model.find(filter);
    //const getModels = queryModel.exec();

    res.status(200).json({
      status: "success",
      message: "Got the Selected Entitie Successfully",
      data: {
        data: getModels,
      },
    });
  });


exports.setFilter = catchAsync( async (req,res,next) => {
  let filter = req.body || {};
  req.filter = filter;
  next();
})

