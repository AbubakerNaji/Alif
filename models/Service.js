const mongoose = require("mongoose");

const ServicesTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desription: {
    type: String,
    default: "No description",
  },
  serviceCategories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceCategories",
    required: true,
  },
  serviceDate: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceDate",
    },
  ],
  companyInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyInfo",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isSponsored: {
    type: Boolean,
    default: false,
  },
  mainImage: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  endDate: {
    type: Date,
    default: null,
  },
  isPermanent: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


ServicesTypeSchema.pre("save", async function (next) {
  const Service = this;

  console.log(Service.isNew);
  if (Service.isNew) {
    await mongoose.model("CompanyInfo").findByIdAndUpdate(Service.companyInfo, {
      $addToSet: { services: Service._id },
    });

    await mongoose
      .model("ServicesCategories")
      .findByIdAndUpdate(Service.serviceCategories, {
        $addToSet: { services: Service._id },
      });
  }

  next();
});

ServicesTypeSchema.pre("findOneAndDelete", async function (next) {
  const service = await this.model.findOne(this.getFilter());

  if (service) {
    await mongoose.model("CompanyInfo").findByIdAndUpdate(service.companyInfo, {
      $pull: { services: service._id },
    });

    await mongoose
      .model("ServiceCategories")
      .findByIdAndUpdate(service.serviceCategories, {
        $pull: { services: service._id },
      });
  }

  next();
});

ServicesTypeSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Service", ServicesTypeSchema);
