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
    assigned_employee_IDs: [{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User'
        type: String
    }]
})

module.exports = mongoose.model("Subtask", subtaskSchema);