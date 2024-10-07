const mongoose = require("mongoose");

const CompanyInfoSchema = new mongoose.Schema({
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
    website: {
        type: String,
        default: "No Website",

    },
    services :[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    }],
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
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

module.exports = mongoose.model("CompanyInfo", CompanyInfoSchema)

