const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const subtaskSchema = new Schema({
    maintask_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MainTask",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date
    },
    // assigned_employee_IDs: [{
    //     // type: mongoose.Schema.Types.ObjectId,
    //     // ref: 'User'
    //     type: String
    // }]
    assigned_employees: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User'
        type: Map,
        of: Boolean
    }
})

module.exports = mongoose.model("Subtask", subtaskSchema);