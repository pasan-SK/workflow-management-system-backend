const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    mainTaskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainTask',
        required: true
    },
    project: {
        type:String,
        required: true
    },
    description: {
        type:String,
        required:true
    },
    link: {
        type:String,
        required:true
    },
    type: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    receiver: {
        type: Map,
        of: Boolean
    },
})

module.exports = mongoose.model("Notification", notificationSchema);