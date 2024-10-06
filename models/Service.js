const { is } = require("express/lib/request");
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
    serviceDate : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceDate",
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
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
    images:[ {
        type: String,
    }],
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
module.exports = mongoose.model("Service", ServicesTypeSchema)
