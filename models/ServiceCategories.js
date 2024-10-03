const mongoose = require("mongoose");
const ServicesTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    serviceType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServicesType",
        required: true,
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
module.exports = mongoose.model("ServicesCategories", ServicesTypeSchema)