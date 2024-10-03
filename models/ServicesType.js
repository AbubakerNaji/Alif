const mongoose = require("mongoose");
const ServicesTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "No description",
    },
    servicesCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServicesCategories",
        required: true,
    }],
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
module.exports = mongoose.model("ServicesType", ServicesTypeSchema)