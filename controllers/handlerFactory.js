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
      const relatedDocs = await doc.populate(relation);
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
    const getModel = await Model.findById({
      _id: req.params.id,
      deletedAt: null,
    });
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

    //console.log(filter);
    let query = Model.find(filter);

    if (req.query.sort) {
      query = query.sort({ createdAt: -1 });
    }
    if (req.query.requestLimit) {
      query = query.limit(req.query.requestLimit);
    }

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
  //console.log(req.query);

  let {
    requestLimit,
    sort,
    createdAtFrom,
    createdAtTo,
    coordinates,
    maxDistance,
    priceFrom,
    priceTo,
    ...filter
  } = req.query || {};
  

  if (coordinates && maxDistance) {
    const coordinates = req.query.coordinates.split(",").map(Number);
    const maxDistance = Number(req.query.maxDistance);

    filter.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coordinates,
        },
        $maxDistance: maxDistance,
      },
    };
  }

  if (priceFrom || priceTo) {
    filter.price = {};
    if (priceFrom) {
      filter.price["$gte"] = Number(priceFrom);
    }
    if (priceTo) {
      filter.price["$lte"] = Number(priceTo);
    }
  }
  if (filter.name) {
    filter.name = {
      $regex: filter.name,
      $options: "i",
    };
  }

  if (createdAtFrom || createdAtTo) {
    filter.createdAt = {};
    if (createdAtFrom) {
      filter.createdAt["$gte"] = new Date(createdAtFrom);
    }
    if (createdAtTo) {
      filter.createdAt["$lte"] = new Date(createdAtTo);
    }
  }

  req.filter = filter;
  next();
});

exports.addlocations = catchAsync(async (req, res, next) => {
  let location = null;

  if (req.body["longitude"] && req.body["latitude"]) {
    location = {
      type: "Point",
      coordinates: [
        parseFloat(req.body["latitude"]),
        parseFloat(req.body["longitude"]),
      ],
    };
  }

  if (location) {
    req.body.location = location;
  }

  next();
});
