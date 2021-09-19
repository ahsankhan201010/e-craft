const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Notification = new mongoose.model("Notification", notificationSchema);
module.exports = Notification;
