const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const mainTaskSchema = new Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subtasks_ids: [{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Subtask'
        type: String
    }]
})

module.exports = mongoose.model("MainTask", mainTaskSchema);