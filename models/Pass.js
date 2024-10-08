const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Service = require("./Service");
const Driver = require("./driver");

const PassScheme = mongoose.Schema({
  serviceDate: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceDate",
      required: true,
    },
  ],
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  kid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kid",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },

  payedAmount: {
    type: Number,
    default: 0,
  },
  costAmount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isCancelled: {
    type: Boolean,
    default: false,
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

PassScheme.pre("save", function (next) {
  catchAsync(async (next) => {
    if (this.isNew || this.isModified("service")) {
      const service = await Service.findById(this.service).populate("serviceDate");

      if (!service) {
        return next(new AppError("Service not found", 404));
      }

      this.costAmount = service.price;

      const userLocation = await mongoose.model("Location").findOne({ user: this.user });
      const nearestDriver = await Driver.findOne({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: userLocation.location.coordinates },
            $maxDistance: 5000, 
          },
        },
      });

      if (!nearestDriver) {
        return next(new AppError("No drivers found nearby", 404));
      }

      this.driver = nearestDriver._id; 
    }

    next();
  }).call(this, next);
});

module.exports = mongoose.model("Pass", PassScheme);
