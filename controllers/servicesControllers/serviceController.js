const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const Service = require("../../models/Service");
const ServiceDate = require("../../models/SerivceDate");
const moment = require("moment");
const {
  deleteOneAuth,
  getWithFilterAuth,
  updateOneAuth,
  createOneAuth,
} = require("../handlerFactoryLogin");

const {
  getWithFilter,
  deleteOne,
  updateOne,
  createOne,
  getOne,
} = require("../handlerFactory");

exports.getServices = getWithFilter(Service);

exports.getWithDatesServices = getWithFilter(Service, ["serviceDate","serviceCategories"]);

//

exports.AddService = catchAsync(async (req, res, next) => {
  let { daysOfWeek, limit, date } = req.body;
  const serviceData = { ...req.body };

  if (req.files.mainImage) {
    serviceData.mainImage = req.files.mainImage[0].path;
  }
  if (req.files.images) {
    serviceData.images = req.files.images.map((file) => file.path);
  }

  const newService = await Service.create(serviceData);

  let serviceDates = [];
  if (typeof daysOfWeek === "string") {
    try {
      daysOfWeek = JSON.parse(daysOfWeek);
    } catch (err) {
      daysOfWeek = [daysOfWeek];
    }
  }

  if (daysOfWeek && Array.isArray(daysOfWeek) && daysOfWeek.length > 0) {
    let currentDate = moment().startOf("day");

    for (let i = 0; i < 30; i++) {
      const dayOfWeek = currentDate.isoWeekday();

      if (daysOfWeek.includes(currentDate.format("dddd").toLowerCase())) {
        serviceDates.push({
          date: currentDate.toDate(),
          service: newService._id,
          limit: limit || 15,
          count: 0,
          isFull: false,
        });
      }

      currentDate.add(1, "day");
    }
  } else if (date) {
    serviceDates.push({
      date: new Date(date),
      service: newService._id,
      limit: limit || 15,
      count: 0,
      isFull: false,
    });
  }
  if (serviceDates.length > 0) {
    const createdServiceDates = await ServiceDate.insertMany(serviceDates);

    const serviceDateIds = createdServiceDates.map(
      (serviceDate) => serviceDate._id
    );

    newService.serviceDate = serviceDateIds;

    await newService.save();
  }

  res.status(201).json({
    status: "success",
    message: "Service and Service Dates created successfully",
    data: {
      service: newService,
      serviceDates,
    },
  });
});

exports.updateService = catchAsync(async (req, res, next) => {
  let { daysOfWeek, limit, date } = req.body;
  const serviceData = { ...req.body };

  if (req.files.mainImage) {
    serviceData.mainImage = req.files.mainImage[0].path;
  }
  if (req.files.images) {
    serviceData.images = req.files.images.map((file) => file.path);
  }
  if (typeof daysOfWeek === "string") {
    try {
      daysOfWeek = JSON.parse(daysOfWeek);
    } catch (err) {
      daysOfWeek = [daysOfWeek];
    }

  }
  serviceData.updatedAt = Date.now();

  const updatedService = await Service.findByIdAndUpdate(
    req.params.id,
    serviceData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedService) {
    return next(new AppError("No service found with that ID", 404));
  }

  let updatedServiceDates = [];

  if (daysOfWeek && Array.isArray(daysOfWeek) && daysOfWeek.length > 0) {
    await ServiceDate.deleteMany({ service: updatedService._id });

    let currentDate = moment().startOf("day");
    for (let i = 0; i < 30; i++) {
      const dayOfWeek = currentDate.isoWeekday();

      if (daysOfWeek.includes(currentDate.format("dddd").toLowerCase())) {
        updatedServiceDates.push({
          date: currentDate.toDate(),
          service: updatedService._id,
          limit: limit || 15,
          count: 0,
          isFull: false,
        });
      }

      currentDate.add(1, "day");
    }
    if (updatedServiceDates.length > 0) {
      const createdServiceDates = await ServiceDate.insertMany(
        updatedServiceDates
      );

      const serviceDateIds = createdServiceDates.map(
        (serviceDate) => serviceDate._id
      );

      updatedService.serviceDate = serviceDateIds;
    }
  } else if (date) {
    const newServiceDate = {
      date: new Date(date),
      service: updatedService._id,
      limit: limit || 15,
      count: 0,
      isFull: false,
    };
    const createdServiceDate = await ServiceDate.create(newServiceDate);

    updatedService.serviceDate.push(createdServiceDate._id);
  }

  await updatedService.save();
  res.status(200).json({
    status: "success",
    message: "Service and Service Dates updated successfully",
    data: {
      service: updatedService,
      serviceDates: updatedServiceDates,
    },
  });
});

exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError("No service found with that ID", 404));
  }

  const serviceDates = await ServiceDate.find({ service: service._id });

  if (serviceDates.length >= 1) {
    service.deletedAt = Date.now();
    await service.save();

    await ServiceDate.updateMany(
      { service: service._id },
      { deletedAt: Date.now() }
    );

    res.status(200).json({
      status: "success",
      message: "Service and associated dates marked as deleted successfully",
      data: {
        service,
      },
    });
  } else {
    service.deletedAt = Date.now();
    await service.save();
    res.status(200).json({
      status: "success",
      message: "Service deleted successfully",
    });
  }
});
