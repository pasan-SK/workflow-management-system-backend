const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const mainTaskSchema = new Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    budget: {
        type: String,
        // required: true
        default: "0"
    },
    // subtasks_ids: [{
    //     // type: mongoose.Schema.Types.ObjectId,
    //     // ref: 'Subtask'
    //     type: String
    // }]
})

module.exports = mongoose.model("MainTask", mainTaskSchema);