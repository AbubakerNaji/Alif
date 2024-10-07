const { Model } = require("mongoose");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.deleteOne = (Model, relations = []) =>
  catchAsync(async (req, res, next) => {
    // Find the document
    let doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError("No entity found", 404));

    let hasRelations = false;

    for (const relation of relations) {
      const relatedDocs = await doc.populate(relation).execPopulate();
      if (relatedDocs[relation] && relatedDocs[relation].length > 0) {
        hasRelations = true;
        break;
      }
    }

  
    if (hasRelations) {
      doc.deletedAt = Date.now();
      await doc.save(); 
    } else {
      await Model.findByIdAndDelete(req.params.id);
    }

    res.status(200).json({
      status: "success",
      message: hasRelations
        ? "Entity was soft-deleted successfully"
        : "Entity was deleted successfully",
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updates = { ...req.body };

    if (req.file) {
      updates.image = req.file.path;
    } else if (req.files) {
      updates.images = req.files.map((file) => file.path);
    }
    updates.updatedAt = Date.now();

    const doc = await Model.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError("No entity found", 404));

    res.status(202).json({
      status: "success",
      message: "Entity was updated successfully",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newModelData = { ...req.body };
    console.log(newModelData);
    console.log(req.body);
    if (req.file) {
      newModelData.image = req.file.path;
    } else if (req.files) {
      newModelData.images = req.files.map((file) => file.path);
    }

    const newModel = new Model(newModelData);
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
    const getModel = await Model.findById({ _id: req.params.id, deletedAt: null });
    res.status(200).json({
      status: "success",
      message: "Got the Selected Entitie Successfully",
      data: {
        data: getModel,
      },
    });
  });
  exports.getWithFilter = (Model, populateOptions = []) =>
    catchAsync(async (req, res, next) => {
      const filter = { ...req.filter, deletedAt: null };
  
      let query = Model.find(filter);
  
      populateOptions.forEach((option) => {
        query = query.populate(option);
      });
  
      const getModels = await query;
  
      res.status(200).json({
        status: "success",
        message: "Got the Selected Entities Successfully",
        data: {
          data: getModels,
        },
      });
    });
  

exports.setFilter = catchAsync(async (req, res, next) => {
  let filter = req.body || {};
  req.filter = filter;
  next();
});
