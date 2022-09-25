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
    },
    status: {
        type: Number,
        default: 0
        /**
         * 0 - Subtask is not yet finished
         * 1 - partially finished (eg: some employees have finished, but some have not finished yet)
         * 2 - subtask completed before dealine 
         * 3 - completed after the deadline
         */
    }
})

module.exports = mongoose.model("Subtask", subtaskSchema);