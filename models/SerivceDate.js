const mongoose = require("mongoose");

const ServiceDateSchema = new mongoose.Schema({
    date: [{
        type: Date,
        required: true,
    }],
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    limit: [{
        type: Number,
        required: true,
        //default: 15,
    }],
    count: [{
        type: Number,
        default: 0,
    }],
    isFull: [{
        type: Boolean,
        default: false,
    }],
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

module.exports = mongoose.model("ServiceDate", ServiceDateSchema)

